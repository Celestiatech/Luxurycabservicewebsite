import nodemailer from 'nodemailer';

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

export function getSmtpConfigFromEnv(env: NodeJS.ProcessEnv): SmtpConfig {
  const host = (env.SMTP_HOST || '').trim();
  const port = Number(env.SMTP_PORT || 0);
  const secure = String(env.SMTP_SECURE || '').trim().toLowerCase() === 'true';
  const user = (env.SMTP_USER || '').trim();
  const pass = (env.SMTP_PASS || '').trim();
  const from = (env.SMTP_FROM || '').trim();

  if (!host) throw new Error('Missing SMTP_HOST');
  if (!port) throw new Error('Missing SMTP_PORT');
  if (!user) throw new Error('Missing SMTP_USER');
  if (!pass) throw new Error('Missing SMTP_PASS');
  if (!from) throw new Error('Missing SMTP_FROM');

  return { host, port, secure, user, pass, from };
}

export function createMailer(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

