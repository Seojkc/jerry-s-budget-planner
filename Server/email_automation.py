import smtplib
import mysql.connector
from email.mime.text import MIMEText

# Database connection
db = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="dbjerrybudget"
)

# Fetch unsent emails
cursor = db.cursor()
cursor.execute("SELECT id, recipient, subject, body FROM email_queue WHERE sent_flag = 0 AND send_at <= CURDATE()")
emails = cursor.fetchall()

# Email credentials (use app passwords for Gmail)
EMAIL_USER = "webmailJerryApp@gmail.com"
EMAIL_PASS = "pvzl yjuc wgai oieo"

# Send emails
for email in emails:
  
  htmlConversion = f"""\
    <html>
      <body>
        {email[3]}  
      </body>
    </html>
    """
      
  msg = MIMEText(htmlConversion, 'html')
  
  msg['Subject'] = email[2]
  msg['From'] = EMAIL_USER
  msg['To'] = email[1]
    


  try:
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
      server.login(EMAIL_USER, EMAIL_PASS)
      server.sendmail(EMAIL_USER, [email[1]], msg.as_string())
    
    # Mark email as sent
    cursor.execute("UPDATE email_queue SET sent_flag = 1 WHERE id = %s", (email[0],))
    db.commit()
  except Exception as e:
    print(f"Failed to send email: {e}")

cursor.close()
db.close()