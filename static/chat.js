const messages = [];
const maxMessageAge = 1200000; // 20 minutes
let enableGigantifiedEmotes = true; // Default to true

document.addEventListener('DOMContentLoaded', function () {
    let token = "";

    function poll() {
        fetch(`poll.json?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(async data => {
            try {
                // Update gigantified emotes setting from server
                if (data.enableGigantifiedEmotes !== undefined) {
                    enableGigantifiedEmotes = data.enableGigantifiedEmotes;
                }
                if (Array.isArray(data.messages) && data.messages.length > 0) {
                    const messages = data.messages.filter(msg => msg.action === 'add');
                    const messageIds = messages.map(msg => msg.message ? msg.message.id : msg.messageId);
                    for (let i = 0; i < data.messages.length; i++) {
                        await processMessage(data.messages[i], messageIds);
                     }
                }
                token = data.token || "";
            } catch (error) {
                console.error('Error processing messages:', error);
            }
            poll();
        })
        .catch(error => {
            console.error('Polling error:', error);
            setTimeout(poll, 1000);
        });
    }

    poll();
});

async function processMessage(message, animatedMessageIds) {
    if (!message || typeof message !== 'object' || !message.action) {
        console.warn('Invalid message:', JSON.stringify(message));
        return;
    }

    switch (message.action) {
        case 'add':
            if (!message.message || typeof message.message !== 'object' || !message.message.id) {
                throw new Error('Invalid message in instruction');
            }
            await showMessage(message.message, message.timestamp, animatedMessageIds[animatedMessageIds.length - 1] === message.message.id ? animatedMessageIds : []);
            break;
        case 'delete':
            await deleteMessage(message.messageId);
            break;
        case 'clear':
            await clearMessages();
            break;
        default:
            console.warn('Unknown instruction action:', message.action);
    }
}

async function showMessage(message, messageTimestamp, animatedMessageIds = []) {
    // Reject messages older than maxMessageAge
    const currentTime = Date.now();
    if (currentTime - messageTimestamp > maxMessageAge) {
        console.warn(`Message with ID ${message.id} is too old and will not be displayed.`);
        return;
    }

    // Check if the chat window exists
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) {
        console.warn('Chat window not found. Cannot display message.');
        return;
    }

    // Create the div for the message using the message object's ID
    const messageDiv = createMessageRow(message);
    messageDiv.style.position = 'relative';
    messageDiv.style.opacity = 0;
    chatWindow.appendChild(messageDiv);
    console.log(`Message with ID ${message.id} added to chat window.`);

    if (animatedMessageIds.length === 0) return;

    // Determine if the top of the chat window needs to be adjusted
    await updateDisplay(animatedMessageIds);
}

async function updateDisplay(animatedMessageIds = []) {
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) return;

    const chatWindowSize = getChatWindowDimensions();
    const screenHeight = window.innerHeight || document.documentElement.clientHeight;
    chatWindow.style.height = chatWindowSize.height + 'px';
    await doAnimations(screenHeight - chatWindowSize.height, animatedMessageIds);
}

async function deleteMessage(messageId) {
    const messageDiv = document.getElementById(`message-${messageId}`);
    if (!messageDiv) {
        console.warn(`Message with ID ${messageId} not found in chat window`);
        return;
    }

    messageDiv.remove();
    await updateDisplay();
}

async function clearMessages() {
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) return;

    // Remove all messages from the chat window
    while (chatWindow.firstChild) {
        chatWindow.removeChild(chatWindow.firstChild);
    }

    // Clear the messages array
    messages.length = 0;

    // Reset the chat window dimensions
    const screenHeight = window.innerHeight || document.documentElement.clientHeight;
    chatWindow.style.top = '0px';
    chatWindow.style.height = screenHeight + 'px';
}

function getChatWindowDimensions() {
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) return { top: 0, height: 0 };

    const screenHeight = window.innerHeight || document.documentElement.clientHeight;

    const lastMessageDiv = chatWindow.lastElementChild;
    if (!lastMessageDiv) return { top: 0, height: screenHeight };

    const lastMessageBottom = getMessageDivBottom(lastMessageDiv.id);
    const chatWindowTop = parseInt(chatWindow.style.top || '0', 10);
    const chatWindowHeight = Math.max(lastMessageBottom - chatWindowTop, screenHeight);
    chatWindow.style.height = chatWindowHeight + 'px';
    return { top: chatWindowTop, height: chatWindowHeight };
}

async function doAnimations(newTop, messageIds) {
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) return;

    const chatWindowTop = parseInt(chatWindow.style.top || '0', 10);
    let movementsExpected = 0;
    if (newTop !== chatWindowTop) {
        chatWindow.style.transition = `top 0.75s`;
        movementsExpected++;
    }

    const seenMessageIds = new Set();
    for (const messageId of messageIds) {
        if (seenMessageIds.has(messageId)) continue; // Skip duplicates
        seenMessageIds.add(messageId);

        const messageDiv = document.getElementById(`message-${messageId}`);
        if (messageDiv) {
             messageDiv.style.transition = `opacity 0.75s`;
            movementsExpected++;
        }
    }

    if (movementsExpected === 0) return;

    requestAnimationFrame(() => {
        if (newTop !== chatWindowTop) {
            chatWindow.style.top = newTop + 'px';
        }
        for (const messageId of messageIds) {
            const messageDiv = document.getElementById(`message-${messageId}`);
            if (messageDiv) {
                messageDiv.style.opacity = 1;
            }
        }
    });

    await new Promise(resolve => {
        let movementsSeen = 0;
        function handler(e) {
            if (e.type === 'transitionend') {
                movementsSeen++;
                if (movementsSeen >= movementsExpected) {
                    chatWindow.removeEventListener('transitionend', handler);
                    resolve();
                }
            }
        }
        chatWindow.addEventListener('transitionend', handler);
    });
}

function getMessageDivBottom(messageDivId) {
    const messageDiv = document.getElementById(messageDivId);
    if (!messageDiv) return 0;
    const leftSide = messageDiv.querySelector('.chat-message-left');
    const rightSide = messageDiv.querySelector('.chat-message-right');
    let messageDivBottom = 0;
    if (leftSide && leftSide.getBoundingClientRect().bottom > messageDivBottom) {
        messageDivBottom = leftSide.getBoundingClientRect().bottom;
    }
    if (rightSide && rightSide.getBoundingClientRect().bottom > messageDivBottom) {
        messageDivBottom = rightSide.getBoundingClientRect().bottom;
    }
    return messageDivBottom;
}

function getMessageText(messageId, parts, isGigantified = false) {
    if (!parts || !Array.isArray(parts)) return '';

    // Find the index of the last emote if gigantified
    let lastEmoteIndex = -1;
    if (isGigantified) {
        for (let i = parts.length - 1; i >= 0; i--) {
            if (parts[i].type === 'emote' || parts[i].type === 'third-party-emote') {
                lastEmoteIndex = i;
                break;
            }
        }
    }

    let formattedParts = parts.map((part, idx) => {
        if (part.type === 'text') {
            return part.text.replace(/[&<>"']/g, ch => `&#${ch.charCodeAt(0)};`);
        }
        if (part.type === 'emote' || part.type === 'third-party-emote') {
            let emoteImageElement = document.createElement('img');
            emoteImageElement.id = `emote-${messageId}-${idx}`;
            emoteImageElement.className = 'emote-image';
            if (idx === lastEmoteIndex) {
                emoteImageElement.classList.add('emote-image-gigantified');
            }
            emoteImageElement.src = part.animatedUrl || part.url;
            emoteImageElement.alt = part.name;
            emoteImageElement.style.verticalAlign = 'middle';
            return emoteImageElement.outerHTML;
        }
        if (part.type === 'cheer') {
            let cheerImageElement = document.createElement('img');
            cheerImageElement.className = 'cheer-image';
            cheerImageElement.src = part.animatedUrl || part.url;
            cheerImageElement.alt = `Cheer ${part.amount}`;
            cheerImageElement.style.verticalAlign = 'middle';
            return cheerImageElement.outerHTML + ` <span class="cheer-amount" style="color: ${part.color}">${part.amount}</span>`;
        }
        console.warn(`Unknown part type: ${part.type}`);
        return '';
    });
    return formattedParts.join('');
}

function getClassFromUserType(prefix, message) {
    if (message.isBroadcaster) {
        return `${prefix}-broadcaster`;
    }
    if (message.isBot && message.isMod) {
        return `${prefix}-bot`;
    }
    if (message.isMod) {
        return `${prefix}-moderator`;
    }
    if (message.isVip) {
        return `${prefix}-vip`;
    }
    if (message.isFounder) {
        return `${prefix}-founder`;
    }
    if (message.isSubscriber) {
        return `${prefix}-subscriber`;
    }
    return `${prefix}-user`;
}

function createMessageRow(message) {
    const messageDiv = document.createElement('div');
    messageDiv.id = `message-${message.id}`;
    messageDiv.className = 'chat-message-row';
    messageDiv.classList.add(getClassFromUserType('chat-message-row', message));
    messageDiv.classList.add('chat-message-row-username-' + (message.username || 'unknown'));

    // Create the left and right containers for the message. The left container
    // contains the profile image, badges, and user display name. The right
    // container contains the message text.
    const leftContainer = document.createElement('div');
    leftContainer.className = 'chat-message-left';
    leftContainer.classList.add('chat-message-left-username-' + (message.username || 'unknown'));

    const badgesAndNameContainer = document.createElement('div');
    badgesAndNameContainer.className = 'badges-and-name-container';

    const rightContainer = document.createElement('div');
    rightContainer.className = 'chat-message-right';
    rightContainer.classList.add('chat-message-right-username-' + (message.username || 'unknown'));

    // Get profile image for the user (for subscribers, mods, etc.) and a blank
    // image if not available or not applicable.
    if (message.profilePicUrl && message.profilePicUrl !== "https://kick.com/favicon.ico") { // Profile images broken on Kick
        const profileImageElementName = `profile-image-${message.userId}`;
        let profileImageElement = document.getElementById(profileImageElementName);
        if (profileImageElement) {
            profileImageElement = profileImageElement.cloneNode(true);
        } else {
            profileImageElement = document.createElement('img');
            profileImageElement.id = profileImageElementName;
            profileImageElement.className = 'profile-image';
            profileImageElement.src = message.profilePicUrl;
            profileImageElement.alt = `${message.userDisplayName}'s profile image`;
        }
        profileImageElement.classList.add(getClassFromUserType('profile-image', message));
        profileImageElement.classList.add('profile-image-username-' + (message.username || 'unknown'));
        leftContainer.appendChild(profileImageElement);
    }

    // Get badges for the user.
    for (const badge of message.badges || []) {
        if (!badge.url) continue; // Skip badges without an image URL
        const badgeElement = document.createElement('img');
        badgeElement.className = 'badge-image';
        badgeElement.src = badge.url;
        badgeElement.alt = badge.title;
        badgesAndNameContainer.appendChild(badgeElement);
    }

    // Get the user display name and add it to the left container.
    const userDisplayNameElement = document.createElement('span');
    userDisplayNameElement.className = 'user-display-name';
    userDisplayNameElement.textContent = message.userDisplayName || message.username;
    userDisplayNameElement.classList.add(getClassFromUserType('user', message));
    userDisplayNameElement.classList.add('user-display-name-username-' + (message.username || 'unknown'));
    badgesAndNameContainer.appendChild(userDisplayNameElement);
    leftContainer.appendChild(badgesAndNameContainer);

    // Add the message text to the right container.
    const messageTextElement = document.createElement('span');
    messageTextElement.className = 'message-text';
    messageTextElement.innerHTML = getMessageText(message.id, message.parts, enableGigantifiedEmotes && message.isGigantified);
    messageTextElement.classList.add(getClassFromUserType('text', message));
    messageTextElement.classList.add('message-text-username-' + (message.username || 'unknown'));
    if (message.action) {
        messageTextElement.classList.add('text-action');
    }
    rightContainer.appendChild(messageTextElement);

    // Add the left and right containers to the message div.
    messageDiv.appendChild(leftContainer);
    messageDiv.appendChild(rightContainer);

    return messageDiv;
}
