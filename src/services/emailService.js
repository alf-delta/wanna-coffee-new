// EmailJS service for sending waitlist submissions
// You'll need to sign up at https://www.emailjs.com/ and configure your service

export const sendWaitlistEmail = async (data) => {
  try {
    // Option 1: Using EmailJS (recommended for simple setup)
    // You'll need to add EmailJS to your project and configure it
    // npm install @emailjs/browser
    
    // Example with EmailJS:
    /*
    import emailjs from '@emailjs/browser';
    
    const templateParams = {
      business_name: data.businessName,
      email: data.email,
      to_email: 'your-email@example.com', // Your email address
    };
    
    const response = await emailjs.send(
      'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
      'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
      templateParams,
      'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
    );
    
    return response;
    */
    
    // Option 2: Simple console log for now (replace with actual email service)
    console.log('Waitlist submission received:', {
      businessName: data.businessName,
      email: data.email,
      timestamp: new Date().toISOString(),
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Formspree integration - replace YOUR_FORM_ID with your actual form ID
export const submitToFormspree = async (data) => {
  try {
    // Using your actual Formspree form ID
    const response = await fetch('https://formspree.io/f/mvgqoary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        message: `New Wanna Coffee Foresight Waitlist Signup\n\nBusiness Name: ${data.businessName}\nEmail: ${data.email}\nTimestamp: ${new Date().toISOString()}`,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Form submission failed');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting to Formspree:', error);
    throw error;
  }
};

// Alternative: Using Netlify Forms (if deployed on Netlify)
export const submitToNetlify = async (data) => {
  try {
    const formData = new FormData();
    formData.append('businessName', data.businessName);
    formData.append('email', data.email);
    formData.append('form-name', 'foresight-waitlist');
    
    const response = await fetch('/', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Form submission failed');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting to Netlify:', error);
    throw error;
  }
}; 