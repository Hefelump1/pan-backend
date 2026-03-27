"""
Email service for sending notifications via HTTP relay
"""
import os
import logging
import requests
from datetime import datetime

logger = logging.getLogger(__name__)

# Email relay configuration
EMAIL_RELAY_URL = os.environ.get('EMAIL_RELAY_URL', '')
EMAIL_RELAY_KEY = os.environ.get('EMAIL_RELAY_KEY', 'PAN_EMAIL_RELAY_2026_SECRET')
SMTP_FROM_EMAIL = os.environ.get('SMTP_FROM_EMAIL', '')
SMTP_FROM_NAME = os.environ.get('SMTP_FROM_NAME', 'Polish Association of Newcastle')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', '')


def send_email(to_email: str, subject: str, html_body: str, text_body: str = None) -> bool:
    """Send an email via HTTP relay on Vodien"""
    if not EMAIL_RELAY_URL:
        logger.warning("EMAIL_RELAY_URL not configured - email not sent")
        return False
    
    try:
        response = requests.post(
            EMAIL_RELAY_URL,
            json={
                "to": to_email,
                "subject": subject,
                "html_body": html_body,
                "from_name": SMTP_FROM_NAME,
                "from_email": SMTP_FROM_EMAIL
            },
            headers={"X-API-Key": EMAIL_RELAY_KEY},
            timeout=15
        )
        
        if response.status_code == 200:
            logger.info(f"Email sent successfully to {to_email}")
            return True
        else:
            logger.error(f"Email relay returned {response.status_code}: {response.text}")
            return False
    except Exception as e:
        logger.error(f"Failed to send email via relay: {e}")
        return False
        
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP Authentication failed: {e}")
        return False
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error sending email: {e}")
        return False
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False


def send_booking_notification(booking: dict) -> bool:
    """
    Send notification email for a new hall booking enquiry
    
    Args:
        booking: Dictionary containing booking details
    
    Returns:
        True if email sent successfully, False otherwise
    """
    if not NOTIFICATION_EMAIL:
        logger.warning("NOTIFICATION_EMAIL not configured")
        return False
    
    # Format the booking date
    booking_date = booking.get('date', 'Not specified')
    if isinstance(booking_date, datetime):
        booking_date = booking_date.strftime('%A, %d %B %Y')
    
    subject = f"New Hall Booking Enquiry - {booking.get('name', 'Unknown')}"
    
    # Create HTML email body
    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #DC2626; color: white; padding: 20px; text-align: center; }}
            .header h1 {{ margin: 0; font-size: 24px; }}
            .content {{ padding: 20px; background-color: #f9f9f9; }}
            .field {{ margin-bottom: 15px; }}
            .field-label {{ font-weight: bold; color: #DC2626; }}
            .field-value {{ margin-top: 5px; }}
            .message-box {{ background-color: white; padding: 15px; border-left: 4px solid #DC2626; margin-top: 10px; }}
            .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Hall Booking Enquiry</h1>
            </div>
            <div class="content">
                <p>A new hall booking enquiry has been submitted through the website:</p>
                
                <div class="field">
                    <div class="field-label">Contact Name:</div>
                    <div class="field-value">{booking.get('name', 'Not provided')}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Email:</div>
                    <div class="field-value"><a href="mailto:{booking.get('email', '')}">{booking.get('email', 'Not provided')}</a></div>
                </div>
                
                <div class="field">
                    <div class="field-label">Phone:</div>
                    <div class="field-value">{booking.get('phone', 'Not provided')}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Event Type:</div>
                    <div class="field-value">{booking.get('event_type', 'Not specified')}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Requested Date:</div>
                    <div class="field-value">{booking_date}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Expected Guests:</div>
                    <div class="field-value">{booking.get('guests', 'Not specified')}</div>
                </div>
                
                <div class="field">
                    <div class="field-label">Additional Message:</div>
                    <div class="message-box">{booking.get('message', 'No additional message')}</div>
                </div>
            </div>
            <div class="footer">
                <p>This is an automated notification from the Polish Association of Newcastle website.</p>
                <p>Please log in to the <a href="https://polishassociationnewcastle.org.au/admin">Admin Panel</a> to manage this booking.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text version
    text_body = f"""
New Hall Booking Enquiry

Contact Name: {booking.get('name', 'Not provided')}
Email: {booking.get('email', 'Not provided')}
Phone: {booking.get('phone', 'Not provided')}
Event Type: {booking.get('event_type', 'Not specified')}
Requested Date: {booking_date}
Expected Guests: {booking.get('guests', 'Not specified')}

Additional Message:
{booking.get('message', 'No additional message')}

---
This is an automated notification from the Polish Association of Newcastle website.
    """
    
    return send_email(NOTIFICATION_EMAIL, subject, html_body, text_body)
