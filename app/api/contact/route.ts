import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      )
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'castpro.contact@gmail.com',
        pass: 'elzy qseg fikk vlol' // Application password
      }
    })

    // Email content
    const mailOptions = {
      from: 'castpro.contact@gmail.com',
      to: 'castpro.hf@gmail.com',
      subject: `Nouveau message de contact - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nouveau message de contact
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Informations du contact :</h3>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #555;">Nom :</strong>
              <span style="color: #333; margin-left: 10px;">${name}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #555;">Email :</strong>
              <span style="color: #333; margin-left: 10px;">${email}</span>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #555;">Message :</strong>
              <div style="color: #333; margin-top: 10px; padding: 15px; background-color: white; border-radius: 5px; border-left: 4px solid #007bff;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 12px; margin-top: 30px;">
            <p>Ce message a été envoyé depuis le formulaire de contact de CastPro.</p>
            <p>Date : ${new Date().toLocaleString('fr-FR', { 
              timeZone: 'Europe/Paris',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      `
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du message. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}
