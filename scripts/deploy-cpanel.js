import * as ftp from 'basic-ftp';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import readline from 'readline';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function promptInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function deployViaCpanelUapi(host, user, token, zipPath) {
  console.log(`\n🌐 Deploying directly to cPanel via HTTPS UAPI (No FTP)...`);
  console.log(`🔗 Target: https://${host}:2083/execute/Fileman`);

  const fileBuffer = fs.readFileSync(zipPath);
  const blob = new Blob([fileBuffer], { type: 'application/zip' });
  const formData = new FormData();
  formData.append('dir', 'public_html');
  formData.append('file-1', blob, 'cpanel_deploy.zip');
  formData.append('overwrite', '1');

  // Step A: Upload zip
  console.log('📤 Uploading cpanel_deploy.zip over HTTPS port 2083...');
  const uploadRes = await fetch(`https://${host}:2083/execute/Fileman/upload_files`, {
    method: 'POST',
    headers: {
      'Authorization': `cpanel ${user}:${token}`
    },
    body: formData
  });

  const uploadJson = await uploadRes.json();
  if (uploadJson.status !== 1) {
    throw new Error(uploadJson.errors ? uploadJson.errors.join(', ') : 'Upload failed via cPanel UAPI');
  }
  console.log('✅ Archive uploaded to cPanel public_html successfully!');

  // Step B: Extract archive via cPanel API2 Fileman::fileop
  console.log('📦 Extracting archive in public_html...');
  const destDir = encodeURIComponent(`/home/${user}/public_html`);
  const extractUrl = `https://${host}:2083/json-api/cpanel?cpanel_jsonapi_user=${user}&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=extract&sourcefiles=public_html%2Fcpanel_deploy.zip&destfiles=${destDir}`;
  const extractRes = await fetch(extractUrl, {
    headers: {
      'Authorization': `cpanel ${user}:${token}`
    }
  });

  const extractJson = await extractRes.json();
  if (!extractJson.cpanelresult || (extractJson.cpanelresult.data && extractJson.cpanelresult.data[0] && extractJson.cpanelresult.data[0].result === 0)) {
    throw new Error('Extraction failed on server');
  }
  console.log('✅ Extracted all files in public_html!');

  // Step C: Delete remote zip
  try {
    const unlinkUrl = `https://${host}:2083/json-api/cpanel?cpanel_jsonapi_user=${user}&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module=Fileman&cpanel_jsonapi_func=fileop&op=unlink&sourcefiles=public_html%2Fcpanel_deploy.zip`;
    await fetch(unlinkUrl, {
      headers: {
        'Authorization': `cpanel ${user}:${token}`
      }
    });
    console.log('🧹 Cleaned up remote deployment zip.');
  } catch (ignored) {}

  return true;
}

async function main() {
  console.log('\n====================================================');
  console.log('🚀 Cox\'s Bazar Pet Shop & Care - Namecheap cPanel Deploy');
  console.log('====================================================\n');

  // Step 1: Run production build
  console.log('📦 Step 1/3: Building production bundle (vite build)...');
  try {
    execSync('node node_modules/vite/bin/vite.js build', { cwd: rootDir, stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Build failed! Please fix build errors before deploying.');
    process.exit(1);
  }

  // Ensure .htaccess exists in dist
  const htaccessSrc = path.join(rootDir, 'public', '.htaccess');
  const htaccessDest = path.join(rootDir, 'dist', '.htaccess');
  if (fs.existsSync(htaccessSrc) && !fs.existsSync(htaccessDest)) {
    fs.copyFileSync(htaccessSrc, htaccessDest);
  }

  // Bundle cpanel_deploy.zip
  console.log('📦 Packaging cpanel_deploy.zip for cPanel public_html...');
  const zipPath = path.join(rootDir, 'cpanel_deploy.zip');
  try {
    execSync(`powershell -Command "Compress-Archive -Path 'dist\\*', 'dist\\.htaccess' -DestinationPath cpanel_deploy.zip -Force"`, { cwd: rootDir });
    console.log('✅ cpanel_deploy.zip ready in root directory.');
  } catch (zErr) {
    console.warn('⚠️ Could not run Compress-Archive; continuing with existing zip if present.');
  }

  const host = process.env.CPANEL_HOST || process.env.CPANEL_FTP_HOST || 'server407.web-hosting.com';
  const user = process.env.CPANEL_USERNAME || process.env.CPANEL_FTP_USER || 'coxswdtb';
  const port = Number(process.env.CPANEL_PORT || process.env.CPANEL_FTP_PORT || 21);
  const remoteDir = process.env.CPANEL_DIR || process.env.CPANEL_FTP_REMOTE_DIR || '/public_html';
  const apiToken = process.env.CPANEL_API_TOKEN;

  // METHOD 1: cPanel Direct HTTPS API (100% No FTP)
  if (apiToken) {
    const startTime = Date.now();
    try {
      await deployViaCpanelUapi(host, user, apiToken, zipPath);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log('\n====================================================');
      console.log(`🎉 100% DIRECT CPANEL DEPLOYMENT SUCCESSFUL! (${elapsed}s)`);
      console.log('✨ All files updated directly in cPanel without FTP!');
      console.log('🌐 Visit: https://coxsbazarpet.shop');
      console.log('🔐 Admin portal: https://coxsbazarpet.shop/#/admin');
      console.log('====================================================\n');
      return;
    } catch (apiErr) {
      console.error('❌ cPanel Direct API Error:', apiErr.message);
      console.log('Falling back to FTP or manual upload...\n');
    }
  }

  // METHOD 2: FTP Connection
  const password = process.env.CPANEL_PASSWORD || process.env.CPANEL_FTP_PASSWORD;
  if (password && password.trim() !== '') {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    const startTime = Date.now();
    console.log(`\n🌐 Attempting FTP connection to ${host}:${port} as ${user}...`);

    try {
      try {
        await client.access({
          host,
          user,
          password,
          port,
          secure: 'explicit'
        });
      } catch (tlsErr) {
        await client.access({
          host,
          user,
          password,
          port,
          secure: false
        });
      }

      console.log('✅ Connected to Namecheap cPanel server successfully!');
      console.log(`\n📤 Uploading dist/ files to ${remoteDir}...`);

      await client.ensureDir(remoteDir);
      await client.uploadFromDir(path.join(rootDir, 'dist'), remoteDir);

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log('\n====================================================');
      console.log(`🎉 DEPLOYMENT SUCCESSFUL! (Completed in ${elapsed}s)`);
      console.log('✨ All files have been updated in cPanel public_html!');
      console.log('🌐 Visit: https://coxsbazarpet.shop');
      console.log('🔐 Admin portal: https://coxsbazarpet.shop/#/admin');
      console.log('====================================================\n');
      client.close();
      return;
    } catch (err) {
      client.close();
      console.warn('⚠️ FTP authentication failed or is restricted by cPanel host.');
    }
  }

  // METHOD 3: 1-Click File Manager Instructions (Zero FTP)
  console.log('\n====================================================');
  console.log('📂 1-CLICK CPANEL DIRECT DEPLOYMENT (NO FTP NEEDED)');
  console.log('====================================================');
  console.log('Your production bundle is built and ready at:');
  console.log(`👉 ${zipPath}`);
  console.log('\nSteps to deploy to coxsbazarpet.shop right now:');
  console.log('1. Go to Namecheap Dashboard -> Hosting List -> Click "Go to cPanel"');
  console.log('2. Open File Manager -> Enter public_html folder');
  console.log('3. Click "Upload" and drop "cpanel_deploy.zip"');
  console.log('4. Right-click "cpanel_deploy.zip" in cPanel and click "Extract"');
  console.log('Done! Your site will be 100% live on https://coxsbazarpet.shop immediately!');
  console.log('====================================================\n');
}

main();
