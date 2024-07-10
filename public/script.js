document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');
    const spinnerContainer = document.getElementById('spinner-container');

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            spinnerContainer.style.display = 'flex';
        });
    });

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            spinnerContainer.style.display = 'flex';
        });
    });
});

