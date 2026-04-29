
// -------- lANGUAGE ------
let currentLang = localStorage.getItem('language') || 'English';

async function updateLanguage(lang) {
  try {
    // 1. Fetch the JSON file for the selected language
    const response = await fetch(`./languages/${lang}.json`);
    const translations = await response.json();

    // 2. Find all elements with the 'data-i18n' attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const path = element.getAttribute('data-i18n').split('.');
      
      // 3. Dig into the JSON object using the dot-notated path (e.g., nav.home)
      let translation = translations;
      path.forEach(key => {
        translation = translation ? translation[key] : null;
      });

      // 4. Update the element text
      if (translation) {
        element.textContent = translation;
      }
    });

    // Save choice and update state
    currentLang = lang;
    localStorage.setItem('language', lang);
  } catch (error) {
    console.error("Could not load language file:", error);
  }
}

// Button Click Event
document.getElementById('lang-btn').addEventListener('click', () => {
  const nextLang = currentLang === 'English' ? 'Portuguese' : 'English';
  updateLanguage(nextLang);
});

// Load default language on startup
window.addEventListener('DOMContentLoaded', () => updateLanguage(currentLang));



// --------- NAVBAR ------------------
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('#nav-list');

menu.addEventListener('click', function() {
  menuLinks.classList.toggle('active');
});

// how many products section
document.addEventListener('DOMContentLoaded', () => {
    // 1. Existing Product Input Generator (from previous step)
    const productCountInputs = document.querySelectorAll('.productCount');
    productCountInputs.forEach(input => {
        input.addEventListener('input', function() {
            const count = parseInt(this.value);
            const container = this.closest('.order-form').querySelector('.productInputsContainer');
            container.innerHTML = '';
            if (count > 0 && count <= 4) {
                for (let i = 1; i <= count; i++) {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'dynamic-product-row';
                    productDiv.innerHTML = `
                        <p style="font-size: 1.2rem; color: var(--main-color); margin-bottom: 5px;">ITEM #${i}</p>
                        <div class="input-row">
                            <div class="input-group">
                                <label data-i18n="inputForm.storeName">Store / location Name</label>
                                <input type="text" name="Product_${i}_Location" placeholder="Zara / 128 Wail Street" required>
                            </div>
                            <div class="input-group">
                                <label data-i18n="inputForm.productName">Product Name (be specific)</label>
                                <input type="text" name="Product_${i}_Item" placeholder="Blue Jeans size 32" required>
                            </div>
                        </div>`;
                    container.appendChild(productDiv);
                    updateLanguage(currentLang);
                }
            }else if(count > 4){
                const productDiv = document.createElement('div');
                productDiv.className = 'dynamic-product-row';
                productDiv.innerHTML = `- More than 5 items, contact us on whatsapp <br>
                - Mais de 5 itens, Fale conosco no WhatsApp`;
                container.appendChild(productDiv)
            }
        });
    });

    // 2. NEW: Form Submission Handler
// 1. Target all your forms
const forms = document.querySelectorAll('.order-form');

forms.forEach(form => {
  form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Stops the page from refreshing

    // 2. Prepare the data to send
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // 3. Send to Web3Forms API
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });

      const result = await response.json();

      if (response.status === 200) {
        // Now show custom message
        alert(`POR - Seu pedido foi enviado! Responderemos em breve.
ENG - Your request has been submitted! we'll respond shortly.
`);
        form.reset(); // Clears the form after success
      } else {
        // ERROR from web3forms 
        console.log(result);
        alert("Something went wrong(order via Whatsapp): " + result.message);
      }
    } catch (error) {
      // NETWORK ERROR
      console.log(error);
      alert("Submission failed. Check your internet connection.");
    }
  });
});
})
 