import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'coxsbazar_petshop_erp_jwt_secret_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminDefaultPin: process.env.ADMIN_DEFAULT_PIN || '1234',
  shopName: "Cox's Bazar Pet Shop & Care",
  shopAddress: "Main Road, Kolatoli Point, Cox's Bazar",
  shopPhone: "+880 1812-345678",
  supabase: {
    url: process.env.SUPABASE_URL || 'https://nhrktaneggpyhfqtcwbn.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocmt0YW5lZ2dweWhmcXRjd2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjY2NTcsImV4cCI6MjEwNDMwMjY1N30.zR-OAAwDW81J3drhYevYanzAtnewwqZFA3pl8OpYyv0',
  }
};
