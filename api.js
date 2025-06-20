 let users = []; // Start with empty array

        function fetchuser(cb) {
            const api = new XMLHttpRequest();
            api.open("GET", "https://jsonplaceholder.typicode.com/users");
            api.onload = () => {
                if (api.status >= 200 && api.status < 300) {
                    cb(null, JSON.parse(api.responseText)); 
                    listUsers(); // Moved inside the success callback
                } else {
                    cb("Did not get data");
                }
            };
            api.onerror = () => cb("Data not received due to network issue"); // Changed to English
            api.send();
        }

        fetchuser((error, data) => {
            if (error) {

                console.log("error")
            } else {
                users = data

            }
        })

        let form = document.getElementById("user-form");
        let nameInput = document.getElementById("name");
        let emailInput = document.getElementById("email");
        let tableBody = document.querySelector("#userTable tbody");
        let submitButton = document.getElementById("submit-btn");
        let editingIndex = null;

        // Display users in the table
        function listUsers() {
            tableBody.innerHTML = "";
            users.forEach((user, index) => {
                let row = document.createElement("tr");
                row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <div class="actions">
                    <button class="edit" onclick="editUser(${index})">Edit</button>
                    <button class="delete" onclick="deleteUser(${index})">Delete</button>
                </div>
            </td>
                `;
                tableBody.appendChild(row);
            });
        }

        // Delete user function
        function deleteUser(index) {
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    users.splice(index, 1);
                    listUsers();
                    Swal.fire({
                        title: "Deleted!",
                        text: "User has been deleted.",
                        icon: "success"
                    });
                }
            });
        }

        // Edit user function
        function editUser(index) {
            let user = users[index];
            nameInput.value = user.name;
            emailInput.value = user.email;
            editingIndex = index;
            submitButton.textContent = "Update User";
        }

        // Form submission handler
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            let name = nameInput.value.trim();
            let email = emailInput.value.trim();

            // Validation
            if (!name) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please enter a name!",
                });
                nameInput.focus();
                return;
            }

            if (!email) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please enter an email!",
                });
                emailInput.focus();
                return;
            }

            if (!validateEmail(email)) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Please enter a valid email!",
                });
                emailInput.focus();
                return;
            }

            if (editingIndex !== null) {
                // Update existing user
                users[editingIndex].name = name;
                users[editingIndex].email = email;
                editingIndex = null;
                submitButton.textContent = "Add User";

                Swal.fire({
                    icon: "success",
                    title: "Done",
                    text: "User has been updated",
                    confirmButtonColor: "#3085d6",
                });
            } else {
                // Add new user
                users.push({ name, email });
                listUsers();
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "New user has been added",
                    confirmButtonColor: "#3085d6",
                });
            }

            // Reset the form
            form.reset();
        });

        // Simple email validation
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // Initialize the table
        listUsers();


