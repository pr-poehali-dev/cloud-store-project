import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет сообщение с контактной формы на почту lolakscratch@yandex.ru"""
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    email = body.get("email", "").strip()
    message = body.get("message", "").strip()

    if not name or not email or not message:
        return {
            "statusCode": 400,
            "headers": headers,
            "body": json.dumps({"error": "Заполните все поля"}, ensure_ascii=False),
        }

    smtp_user = "lolakscratch@yandex.ru"
    smtp_password = os.environ["SMTP_PASSWORD"]

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Новое сообщение с сайта Облако от {name}"
    msg["From"] = smtp_user
    msg["To"] = smtp_user

    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a6fd8;">Новое сообщение с сайта Облако</h2>
      <table style="width:100%; border-collapse:collapse;">
        <tr><td style="padding:8px; color:#666;">Имя:</td><td style="padding:8px; font-weight:bold;">{name}</td></tr>
        <tr><td style="padding:8px; color:#666;">Email:</td><td style="padding:8px; font-weight:bold;">{email}</td></tr>
      </table>
      <div style="margin-top:16px; padding:16px; background:#f0f7ff; border-radius:8px;">
        <p style="color:#333; white-space:pre-wrap;">{message}</p>
      </div>
    </div>
    """
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.yandex.ru", 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, smtp_user, msg.as_string())

    return {
        "statusCode": 200,
        "headers": headers,
        "body": json.dumps({"ok": True}),
    }