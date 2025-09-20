$(document).ready(function() {
    getUserId();
    fetchLikes();
    const honeyPot = $('#botPot');
    let botPot = "";
    honeyPot.on('change', function() {
        let botStop = honeyPot.val();
        console.log("BotPot: ", botStop);
        botPot = botStop;
    });

    $('#exampleModalCenter').on('show.bs.modal', function(event) {
        let button = $(event.relatedTarget);
        let projectType = button.data('bs-platform');
        let projectImage = button.data('bs-image');
        let projectTitle = button.data('bs-title');
        let projectLink = button.data('bs-link');
        let projectDescription = button.data('bs-description');
        let projectId = button.data('bs-like-id');

        $('#project-like').off('click').on('click', function() {
            storeVote(projectId);
        })

        let modal = $(this);
        modal.find('.text-content h3 span').text(projectType);
        modal.find('img').attr('src', projectImage);
        modal.find('.text-content h3').text(projectTitle);
        modal.find('.text-content p').text(projectDescription);
        if(projectLink) {
            modal.find('#project-link').attr('href', projectLink).css('display', 'inline-block');
        } else {
            modal.find('#project-link').css('display', 'none');
        }
        
    });

    function storeVote(projId) {
     // console.log("ProjectID: ",projId);
        let userId = getUserId();
    //  console.log("UserId: ", userId);
        $.ajax({
            url: 'https://hamilldesignstesting.com/store-like.php',
            type:'POST',
            crossDomain: true,
            data: {
                likes_id: projId,
                user_id: userId
            },
            dataType: 'json',
            success: function(response) {
              //  console.log("response: ",response);
              //  console.log("response.liked: ",response.liked);
                if(response.liked) {
                    console.log("It was liked");
                    fetchLikes();
                } else {
                    console.log("You already liked it");
                }
            },
            error: function() {
                console.log("error");
            }
        });
    }

// Function to fetch and display likes
function fetchLikes() {
try {
    $.ajax({
        url: 'https://hamilldesignstesting.com/get-likes.php',  // URL to your PHP script
        type: 'GET',           // Use GET method to fetch data
        crossDomain: true,      // Allow cross-origin requests
        dataType: 'json',       // Expect JSON data in response
        success: function(response) {
           // console.log(response);  // Check the data in the browser console
    
            // Loop through each project and update the like count display
            response.forEach(function(like) {
                $('#project-like-' + like.likes_id).text(like.like_count);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching likes:', error);  // Log any error
        }
    });
    } catch (error) {
        console.log("There was an error fetching the likes", error);
    }
}

    // Function to generate a random user ID (UUID-like)
function generateUserId() {
    return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Check if the cookie 'user_id' exists
function getUserId() {
    let userId = getCookie('user_id');
    
    if (!userId) {
        // If not, generate a new ID and set it as a cookie
        userId = generateUserId();
        setCookie('user_id', userId, 365); // 365 days expiry
    }
    
    return userId;
}

// Get a cookie by name
function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        
        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    return null;
}

// Set a cookie
function setCookie(name, value, days) {
    let expires = "";
    
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Example usage:
let userId = getUserId();
// console.log("User ID: ", userId);
$('#closeModal').on('click', function() {
    $('#submitModal').css('display', 'none');
        $('#submitModal').css('opacity', '0');
        $('#submitModal').attr('aria-hidden');
});

document.getElementById('email-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    
    const form = this;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Disable submit button to prevent multiple submissions
    submitButton.disabled = true;
    submitButton.textContent = 'Validating...';
    
    grecaptcha.ready(function() {
        grecaptcha.execute('6Ldm0csrAAAAADYOpNccKq00frpohxZDcrKnXOOk', {action: 'submit'}).then(function(token) {
            // Send token to your validation server
            fetch('https://hamilldesignstesting.com/recaptcha-validate.php', {
                method: 'POST',
                crossDomain: true,  
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // reCAPTCHA validation passed - submit the form
                    console.log('reCAPTCHA validation successful, score:', data.score);
                    
                    // Add the token to the form as a hidden field (optional)
                    const tokenInput = document.createElement('input');
                    tokenInput.type = 'hidden';
                    tokenInput.name = 'recaptcha_token';
                    tokenInput.value = token;
                    form.appendChild(tokenInput);
                    
                    // Submit the form
                    form.submit();
                } else {
                    // reCAPTCHA validation failed
                    alert('Security validation failed. Please try again.');
                    console.error('reCAPTCHA validation failed:', data.error);
                    
                    // Re-enable submit button
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit';
                }
            })
            .catch(error => {
                console.error('Error validating reCAPTCHA:', error);
                alert('An error occurred. Please try again.');
                
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = 'Submit';
            });
        });
    });
});
});
