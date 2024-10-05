$(document).ready(function() {
    getUserId();
    fetchLikes();

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
        console.log("ProjectID: ",projId);
        let userId = getUserId();
        console.log("UserId: ", userId);
        $.ajax({
            url: 'https://hamilldesignstesting.com/store-like.php',
            type:'POST',
            crossDomain: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            data: {
                likes_id: projId,
                user_id: userId
            },
            success: function(response) {
                if(response.liked) {
                    console.log("It was liked");
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
        url: 'https://hamilldesignstesting.com/get-likes.php?callback=?',  // URL to the PHP file that returns likes count
        type: 'GET',           // Use GET to fetch data
        crossDomain: true,
        dataType: 'jsonp',
        headers: {
            'Access-Control-Allow-Origin': '*',
          },
        success: function(response) {
            console.log(response);
            let likes = JSON.parse(response);  // Parse the JSON response

            // Loop through each project and update the like count display
            likes.forEach(function(like) {
                console.log(like);
                $('#project-like-' + like.likes_id).text(like.like_count);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching likes:', error);
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
console.log("User ID: ", userId);
$('#closeModal').on('click', function() {
    $('#submitModal').css('display', 'none');
        $('#submitModal').css('opacity', '0');
        $('#submitModal').attr('aria-hidden');
})
const honeyPot = $('#botPot');
let botPot = "";
honeyPot.on('change', function() {
    let botStop = honeyPot.val();
    console.log("BotPot: ", botStop);
    botPot = botStop;
})
const formSubmit = $('#submit');

console.log("FormSubmit: ", formSubmit);

$("form").submit(function(event) {
    event.preventDefault();
    console.log("Button works");
    if(botPot != "") {
        formSubmit.attr('disabled', 'disabled');
        console.log("Bot filled stopped");
    } else {
        $(this).unbind('submit').submit();
        console.log("Submitted the form");
        $('#email-form input').each(function() {
            if($(this).val() == "Website form email") {
                $(this).val("Website form email");
            } else {
                $(this).val("");
            }
        });
        $('#contact-message').val("");
        $('#submitModal').css('display', 'block');
        $('#submitModal').css('opacity', '1');
        $('#submitModal').removeAttr('aria-hidden');
    }
});

});


