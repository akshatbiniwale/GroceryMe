function showSuccessAlert() {
    const urlInvalidCu = new URLSearchParams(window.location.search);
    if (urlInvalidCu.get('success') === 'false') {
        alert('Invalid Credentials!');
    }
}
showSuccessAlert();