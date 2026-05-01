import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: 'Unoqual <onboarding@resend.dev>',
      to: email,
      subject: 'Recuperação de Senha - Unoqual',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 12px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 8px;">Unoqual</h1>
            <p style="color: #64748b; font-weight: 500;">SOLUÇÃO EM QUALIDADE E DIMENSIONAMENTO</p>
          </div>
          
          <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 16px;">Recuperação de Senha</h2>
          
          <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">
            Você solicitou a redefinição de senha para sua conta no Unoqual. Clique no botão abaixo para escolher uma nova senha:
          </p>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${resetLink}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Redefinir Minha Senha
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
            Este link é válido por <strong>1 hora</strong>. Se você não solicitou esta alteração, ignore este e-mail.
          </p>
          
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            Unoqual - Sistema de Gestão e Dimensionamento de Enfermagem
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return { success: false, error: "Falha ao enviar e-mail de recuperação." };
  }
}
