document.getElementById('createBtn').addEventListener('click', function() {
    const template = document.getElementById('template').value;
    const color = document.getElementById('color').value;
    const username = document.getElementById('username').value;
    const imageUpload = document.getElementById('imageUpload').files[0];

    // You'll want to actually generate the intro card here.
    // Below is a simple placeholder for the action.
    const displayArea = document.getElementById('introCardDisplay');
    displayArea.innerHTML = `
        <h2 style="color:${color};">${username}</h2>
        <p>Template: ${template}</p>
        <p>Change this area to show the uploaded image and styled according to the selected template.</p>
    `;

    // If an image was uploaded, read and display it.
    if (imageUpload) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            displayArea.appendChild(img);
        };
        reader.readAsDataURL(imageUpload);
    }
});
