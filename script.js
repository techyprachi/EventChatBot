// Chatbot functionality for Event Management App
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const messagesContainer = document.getElementById('chatbot-messages');
    const chatForm = document.getElementById('chatbot-form');
    const chatInput = document.getElementById('chatbot-input');
    const messagesEnd = document.getElementById('messages-end');
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWrapper = document.getElementById('chatbot-wrapper');
    const chatbotMinimize = document.getElementById('chatbot-minimize');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    // Knowledge base for the chatbot
    const knowledgeBase = {
        greetings: ['hello', 'hi', 'hey', 'greetings', 'howdy'],
        createEvent: ['create event', 'new event', 'schedule event', 'plan event', 'organize event'],
        findEvents: ['find events', 'search events', 'discover events', 'upcoming events', 'events near me'],
        buyTickets: ['buy tickets', 'purchase tickets', 'get tickets', 'ticket prices', 'available tickets'],
        venueInfo: ['venue', 'location', 'address', 'directions', 'parking'],
        eventDetails: ['details', 'information', 'specifics', 'about event', 'event description'],
        speakerInfo: ['speakers', 'performers', 'artists', 'hosts', 'presenters'],
        schedule: ['schedule', 'agenda', 'program', 'timetable', 'itinerary'],
        cancelEvent: ['cancel', 'refund', 'delete event', 'remove event'],
        help: ['help', 'support', 'assistance', 'guide', 'tutorial'],
    };

    // Featured events data - could be fetched from API
    const featuredEvents = [
        {
            id: 1,
            title: "Summer Music Festival",
            date: "APR 20",
            location: "Central Park, New York",
            time: "2:00 PM - 10:00 PM",
            price: "$49.99",
            image: "/api/placeholder/400/200"
        },
        {
            id: 2,
            title: "Tech Conference 2025",
            date: "MAY 5",
            location: "Convention Center, Boston",
            time: "9:00 AM - 6:00 PM",
            price: "$89.99",
            image: "/api/placeholder/400/200"
        },
        {
            id: 3,
            title: "Food & Wine Festival",
            date: "APR 30",
            location: "Waterfront Plaza, Chicago",
            time: "12:00 PM - 8:00 PM",
            price: "$35.00",
            image: "/api/placeholder/400/200"
        }
    ];

    // Initialize chatbot
    initializeChatbot();

    function initializeChatbot() {
        // Set initial state
        chatbotWrapper.style.display = 'none';
        
        // Load chat history if available
        const savedMessages = loadChatHistory();
        if (savedMessages && savedMessages.length > 0) {
            // Clear default message
            messagesContainer.innerHTML = '';
            
            // Add saved messages
            savedMessages.forEach(msg => {
                addMessageToDOM(msg.text, msg.sender);
            });
            
            // Add messages-end div back
            const endDiv = document.createElement('div');
            endDiv.id = 'messages-end';
            messagesContainer.appendChild(endDiv);
        }
        
        // Initialize event listeners
        setupEventListeners();
    }

    function setupEventListeners() {
        // Toggle chatbot visibility
        chatbotToggle.addEventListener('click', function() {
            if (chatbotWrapper.style.display === 'block') {
                chatbotWrapper.style.display = 'none';
            } else {
                chatbotWrapper.style.display = 'block';
                scrollToBottom();
                chatInput.focus();
            }
        });

        // Minimize chatbot
        chatbotMinimize.addEventListener('click', function() {
            chatbotWrapper.style.display = 'none';
        });

        // Handle suggestion chips
        suggestionChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const suggestionText = this.textContent;
                sendMessage(suggestionText);
            });
        });

        // Handle form submission
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userInput = chatInput.value.trim();
            if (userInput === '') return;
            
            sendMessage(userInput);
        });
    }

    // Send a message (from input or suggestion chip)
    function sendMessage(text) {
        // Add user message to DOM
        addMessageToDOM(text, 'user');
        
        // Clear input
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Generate and add bot response after a delay
        setTimeout(() => {
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add bot response
            const botResponse = generateResponse(text);
            addMessageToDOM(botResponse, 'bot');
            
            // Save chat history
            saveChatHistory();
        }, 1000 + Math.random() * 500); // Random delay between 1-1.5s for realism
    }

    // Add a message to the DOM
    function addMessageToDOM(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'bot') {
            // Create avatar for bot
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'bot-avatar';
            const iconElement = document.createElement('i');
            iconElement.className = 'fas fa-robot';
            avatarDiv.appendChild(iconElement);
            messageDiv.appendChild(avatarDiv);
        }
        
        // Create message content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        messageDiv.appendChild(contentDiv);
        
        // Insert before the messagesEnd div
        messagesContainer.insertBefore(messageDiv, messagesEnd);
        
        // Scroll to bottom
        scrollToBottom();
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bot-typing';
        typingDiv.id = 'typing-indicator';
        
        const botAvatar = document.createElement('div');
        botAvatar.className = 'bot-avatar';
        const iconElement = document.createElement('i');
        iconElement.className = 'fas fa-robot';
        botAvatar.appendChild(iconElement);
        typingDiv.appendChild(botAvatar);
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingIndicator.appendChild(dot);
        }
        typingDiv.appendChild(typingIndicator);
        
        // Insert before the messagesEnd div
        messagesContainer.insertBefore(typingDiv, messagesEnd);
        
        // Scroll to bottom
        scrollToBottom();
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Scroll to the bottom of the chat
    function scrollToBottom() {
        messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }

    // Bot response generator with enhanced responses
    function generateResponse(userInput) {
        const input = userInput.toLowerCase();
        
        // Check for matches in knowledge base
        if (knowledgeBase.greetings.some(phrase => input.includes(phrase))) {
            return getRandomResponse([
                "Hello! How can I help you with your events today?",
                "Hi there! Looking for events or planning to create one?",
                "Hey! I'm here to help with all your event needs."
            ]);
        }
        
        if (knowledgeBase.createEvent.some(phrase => input.includes(phrase))) {
            return getRandomResponse([
                "To create a new event, go to the 'Create' tab and fill out the event details form. Would you like me to guide you through the process?",
                "Creating an event is easy! Just click the 'Create' button in the navigation bar to get started. Need help with anything specific?",
                "I'd be happy to help you create an event! You'll need to provide details like date, venue, description, and ticket options. Ready to start?"
            ]);
        }
        
        if (knowledgeBase.findEvents.some(phrase => input.includes(phrase))) {
            return getRandomResponse([
                "You can find events by using our search feature or browsing by category, date, or location. What type of events are you interested in?",
                "We have lots of exciting events! You can filter by date, location, or category. Are you looking for something specific?",
                "Our featured events section showcases popular upcoming events. You can also search or browse by categories. Any particular interests?"
            ]);
        }
        
        if (knowledgeBase.buyTickets.some(phrase => input.includes(phrase))) {
            const randomEvent = featuredEvents[Math.floor(Math.random() * featuredEvents.length)];
            return `To purchase tickets, select an event and click the 'Buy Tickets' button. For example, "${randomEvent.title}" is coming up on ${randomEvent.date} and tickets are ${randomEvent.price}. Would you like to see more ticket options?`;
        }
        
        if (knowledgeBase.venueInfo.some(phrase => input.includes(phrase))) {
            return getRandomResponse([
                "Event venues include detailed information such as address, maps, parking options, and accessibility features. Is there a specific venue you'd like information about?",
                "Our venue pages show locations, parking information, and accessibility details. Which venue are you interested in?",
                "You can find venue details on each event page, including maps and directions. Need help finding a particular venue?"
            ]);
        }
        
        if (knowledgeBase.eventDetails.some(phrase => input.includes(phrase))) {
            return getRandomResponse([
                "Event pages show all details including description, time, date, venue, organizer information, and attendee list. Which event are you interested in?",
                "You'll find comprehensive information on each event page including schedules, performers, and reviews. Any specific event you're curious about?",
                "Each event listing includes details about schedule, pricing, location, and more. You can also see photos from past similar events. Looking for a specific event?"
            ]);
        }
        
        if (knowledgeBase.speakerInfo.some(phrase => input.includes(phrase))) {
            return getRandomResponse([
                "Speaker and performer profiles include their bio, previous events, social media links, and other upcoming appearances. Would you like to search for a specific speaker?",
                "You can view detailed profiles of all speakers and performers, including their background and expertise. Anyone in particular you're looking for?",
                "Our platform features complete performer profiles with photos, bios, and their event history. Which speaker are you interested in?"
            ]);
        }
        
        if (knowledgeBase.schedule.some(phrase => input.includes(phrase))) {
            return getRandomResponse([
                "Event schedules can be viewed on the event page under 'Agenda'. You can also add sessions to your personal schedule and set reminders. Would you like to see your current schedule?",
                "You can find the complete schedule for any event by clicking on the event and selecting the 'Schedule' tab. Want me to show you how to set reminders?",
                "Each event has a detailed schedule you can browse. You can also create your own personalized agenda by saving sessions you're interested in."
            ]);
        }
        
        if (knowledgeBase.cancelEvent.some(phrase => input.includes(phrase))) {
            return getRandomResponse([
                "If you need to cancel an event or request a refund, go to 'My Events' and select the event you wish to cancel. Our cancellation policy varies by event. Would you like help with canceling a specific event?",
                "To cancel an event, navigate to your profile, select 'My Events' and then choose the cancellation option. Note that refund policies vary. Need help with a specific cancellation?",
                "Cancellations can be processed through your account dashboard. Remember that each event may have different refund policies and deadlines. Can I help with a particular event?"
            ]);
        }
        
        if (knowledgeBase.help.some(phrase => input.includes(phrase))) {
            return "I can help with creating events, finding events, purchasing tickets, managing your schedule, and more. What specific assistance do you need?";
        }
        
        if (input.includes('thank')) {
            return getRandomResponse([
                "You're welcome! Is there anything else I can help you with?",
                "Happy to help! Let me know if you need anything else.",
                "Anytime! Feel free to ask if you have more questions about events."
            ]);
        }
        
        // If no direct matches, provide a general response
        return getRandomResponse([
            "I'm not sure I understand. Would you like help with creating an event, finding events, buying tickets, or something else?",
            "I didn't quite catch that. You can ask me about events, tickets, venues, or scheduling. How can I assist you?",
            "Let's try a different approach. Are you looking to attend an event or create one?"
        ]);
    }

    // Get a random response from an array
    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Save chat history to local storage
    function saveChatHistory() {
        const messages = [];
        const messageElements = document.querySelectorAll('.message');
        
        messageElements.forEach(el => {
            let sender;
            if (el.classList.contains('user-message')) {
                sender = 'user';
            } else if (el.classList.contains('bot-message')) {
                sender = 'bot';
            }
            
            if (sender) {
                const textElement = el.querySelector('.message-content');
                if (textElement) {
                    messages.push({
                        text: textElement.textContent,
                        sender: sender
                    });
                }
            }
        });
        
        localStorage.setItem('eventChatbotHistory', JSON.stringify(messages));
    }

    // Load chat history from local storage
    function loadChatHistory() {
        const history = localStorage.getItem('eventChatbotHistory');
        return history ? JSON.parse(history) : null;
    }

    // Clear chat history
    function clearChatHistory() {
        localStorage.removeItem('eventChatbotHistory');
    }

    // Example of how to integrate with backend API
    async function fetchEventData(eventId) {
        try {
            const response = await fetch(`/api/events/${eventId}`);
            const eventData = await response.json();
            return eventData;
        } catch (error) {
            console.error('Error fetching event data:', error);
            return null;
        }
    }
});