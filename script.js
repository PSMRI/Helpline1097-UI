// Call counter variables
let callCount = 0;
let callTimer = null;
let callStartTime = null;
let currentRow = null;

// Function to start video call
function startVideoCall() {
    // Increment call count
    callCount++;
    
    // Update UI to show call count
    document.getElementById('callStatus').textContent = `Call in Progress (Call #${callCount})`;
    
    // Start the timer
    callStartTime = new Date();
    callTimer = setInterval(updateCallDuration, 1000);
    
    // Show end call button and hide start call button
    document.getElementById('startCallBtn').classList.add('d-none');
    document.getElementById('endCallBtn').classList.remove('d-none');
    
    // Update call status
    document.getElementById('callStatusDetail').textContent = 'In Progress';
    document.getElementById('recordingStatus').textContent = 'Recording';

    // Increment Call Attempt Number in the table
    if (currentRow) {
        try {
            // Get all cells in the current row
            const cells = currentRow.cells;
            if (cells && cells.length >= 6) {
                // The Call Attempt Number is in the 6th column (index 5)
                const attemptCell = cells[5];
                console.log('Current attempt cell:', attemptCell); // Debug log
                
                // Get current value and increment
                let currentAttempts = parseInt(attemptCell.textContent.trim()) || 0;
                currentAttempts++;
                
                // Update the cell
                attemptCell.textContent = currentAttempts.toString();
                console.log('Updated attempts to:', currentAttempts); // Debug log
            } else {
                console.log('Not enough cells in row:', cells.length); // Debug log
            }
        } catch (error) {
            console.error('Error updating call attempt:', error); // Debug log
        }
    } else {
        console.log('No current row selected'); // Debug log
    }
}

// Function to end video call
function endVideoCall() {
    // Clear the timer
    if (callTimer) {
        clearInterval(callTimer);
        callTimer = null;
    }
    
    // Reset UI
    document.getElementById('callStatus').textContent = 'Ready to Start';
    document.getElementById('callDuration').textContent = '00:00:00';
    document.getElementById('startCallBtn').classList.remove('d-none');
    document.getElementById('endCallBtn').classList.add('d-none');
    
    // Update call status
    document.getElementById('callStatusDetail').textContent = 'Completed';
    document.getElementById('recordingStatus').textContent = 'Recording Stopped';
}

// Function to update call duration
function updateCallDuration() {
    if (callStartTime) {
        const now = new Date();
        const diff = now - callStartTime;
        
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        // Format the duration
        const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update the duration display
        document.getElementById('callDuration').textContent = duration;
    }
}

// Function to handle view action in table
function viewRecord(row) {
    currentRow = row;
    console.log('Selected row:', row); // Debug log
    
    // Show video call section
    document.getElementById('mainContent').classList.add('d-none');
    document.getElementById('videoCallSection').classList.remove('d-none');
    
    // Update call details
    const cells = row.cells;
    if (cells && cells.length >= 8) {
        document.getElementById('callBeneficiaryId').textContent = cells[3].textContent; // Mother Id
        document.getElementById('callPhoneNumber').textContent = cells[1].textContent; // Phone Number
        document.getElementById('callEcdType').textContent = cells[7].textContent; // ECD Call Type
    }
}

// Function to change tabs
function changeTab(tab) {
    const buttons = document.querySelectorAll('.tabs .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    // Add your tab content switching logic here
}

// Function to handle consent
function giveConsent() {
    document.getElementById('consentCard').classList.add('d-none');
    document.getElementById('linkManagement').classList.remove('d-none');
}

function declineConsent() {
    // Handle consent decline
    alert('Video consultation declined. Please proceed with audio call.');
    // Add your decline handling logic here
}

// Function to send video link
function sendVideoLink() {
    document.getElementById('sendLinkBtn').classList.add('d-none');
    document.getElementById('resendLinkBtn').classList.remove('d-none');
    document.getElementById('linkReceivedConfirm').classList.remove('d-none');
}

// Function to resend video link
function resendVideoLink() {
    // Add your resend logic here
    alert('Video consultation link resent!');
}

// Function to confirm link received
function confirmLinkReceived(received) {
    if (received) {
        document.getElementById('linkManagement').classList.add('d-none');
        document.getElementById('videoInterface').classList.remove('d-none');
    } else {
        alert('Please ensure the beneficiary receives the link before proceeding.');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add any initialization code here
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Add your search functionality here
        });
    }

    // Add sample data to the table for testing
    const tableBody = document.getElementById('worklistTableBody');
    if (tableBody) {
        const sampleData = [
            ['1', '9876543210', '9876543210', 'M001', '2h', '0', '2024-03-20', 'Follow-up', 'View', 'Action'],
            ['2', '9876543211', '9876543211', 'M002', '1h', '0', '2024-03-20', 'Initial', 'View', 'Action']
        ];

        sampleData.forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach((cellData, index) => {
                const cell = document.createElement('td');
                if (index === 8) { // View column
                    const viewBtn = document.createElement('button');
                    viewBtn.className = 'btn btn-sm btn-primary';
                    viewBtn.textContent = 'View';
                    viewBtn.onclick = () => viewRecord(row);
                    cell.appendChild(viewBtn);
                } else {
                    cell.textContent = cellData;
                }
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
    }
}); 