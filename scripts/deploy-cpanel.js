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

  // Step 2: Prepare FTP credentials
  const host = process.env.CPANEL_FTP_HOST || 'server407.web-hosting.com';
  const user = process.env.CPANEL_FTP_USER || 'coxswdtb';
  const port = Number(process.env.CPANEL_FTP_PORT || 21);
  const remoteDir = process.env.CPANEL_FTP_REMOTE_DIR || '/public_html';

  let password = process.env.CPANEL_FTP_PASSWORD;

  if (!password) {
    console.log(`\n🌐 cPanel Server: ${host}`);
    console.log(`👤 cPanel Username: ${user}`);
    password = await promptInput('🔐 Please enter your Namecheap cPanel password: ');

    if (!password) {
      console.error('❌ Password cannot be empty.');
      process.exit(1);
    }

    const saveChoice = await promptInput('💾 Would you like to save this password in .env for one-click future deploys? (y/n): ');
    if (saveChoice.toLowerCase() === 'y' || saveChoice.toLowerCase() === 'yes') {
      const envPath = path.join(rootDir, '.env');
      let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
      if (envContent.includes('CPANEL_FTP_PASSWORD=')) {
        envContent = envContent.replace(/CPANEL_FTP_PASSWORD=.*(?:\r?\n|$)/, `CPANEL_FTP_PASSWORD=${password}\n`);
      } else {
        envContent += `\n# Namecheap cPanel FTP Deployment\nCPANEL_FTP_HOST=${host}\nCPANEL_FTP_USER=${user}\nCPANEL_FTP_PASSWORD=${password}\nCPANEL_FTP_PORT=21\nCPANEL_FTP_REMOTE_DIR=/public_html\n`;
      }
      fs.writeFileSync(envPath, envContent, 'utf8');
      console.log('✅ Password saved to .env securely (remember .env is git-ignored).\n');
    }
  }

  // Step 3: Connect and upload via basic-ftp
  const client = new ftp.Client();
  client.ftp.verbose = false;

  const startTime = Date.now();
  console.log(`\n🌐 Step 2/3: Connecting to ${host}:${port} as ${user}...`);

  try {
    await client.access({
      host,
      user,
      password,
      port,
      secure: false
    });

    console.log('✅ Connected to Namecheap cPanel server successfully!');
    console.log(`\n📤 Step 3/3: Uploading dist/ files to ${remoteDir}...`);

    await client.ensureDir(remoteDir);
    await client.uploadFromDir(path.join(rootDir, 'dist'), remoteDir);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n====================================================');
    console.log(`🎉 DEPLOYMENT SUCCESSFUL! (Completed in ${elapsed}s)`);
    console.log('✨ All files have been updated in cPanel public_html!');
    console.log('🌐 Visit your live website now!');
    console.log('🔐 Admin portal: /#/admin');
    console.log('====================================================\n');

  } catch (err) {
    console.error('\n❌ FTP Deployment Error:', err.message);
    console.log('\n💡 Troubleshooting Tips:');
    console.log('1. Verify host is server407.web-hosting.com (or IP 104.207.79.74)');
    console.log('2. Verify your cPanel username (coxswdtb) and password.');
    console.log('3. If cPanel has FTP Restrictions, check cPanel -> "FTP Accounts".');
  } finally {
    client.close();
  }
}

main();
