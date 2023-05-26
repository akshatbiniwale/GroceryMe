function showSuccessAlert() {
    const urlInvalidRet = new URLSearchParams(window.location.search);
    if (urlInvalidRet.get('success') === 'false') {
        alert('Invalid Credentials!');
    }
}
showSuccessAlert();