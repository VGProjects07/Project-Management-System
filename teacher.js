// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTeacherApp();
});

function initializeTeacherApp() {
    // Set current date
    updateCurrentDate();
    
    // Load initial page
    loadTeacherPage('dashboard');
    
    // Setup event listeners
    setupTeacherEventListeners();
    
    // Initialize theme from localStorage
    initTeacherTheme();
}

// Theme Management
function initTeacherTheme() {
    const savedTheme = localStorage.getItem('teacherTheme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateTeacherThemeToggleButton();
    }
}

function toggleTeacherTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('teacherTheme', isDark ? 'dark' : 'light');
    updateTeacherThemeToggleButton();
}

function updateTeacherThemeToggleButton() {
    const themeToggle = document.getElementById('themeToggleTeacher');
    if (themeToggle) {
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i> Light Mode'
            : '<i class="fas fa-moon"></i> Dark Mode';
    }
}

// Date Display
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Page Navigation
function setupTeacherEventListeners() {
    // Navigation menu clicks
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.parentElement.getAttribute('data-page');
            loadTeacherPage(page);
            
            // Update active state
            document.querySelectorAll('.main-nav li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    });
    
    // Quick action buttons
    document.querySelectorAll('.action-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            loadTeacherPage(page);
            
            // Update active state
            document.querySelectorAll('.main-nav li').forEach(li => {
                li.classList.remove('active');
                if (li.getAttribute('data-page') === page) {
                    li.classList.add('active');
                }
            });
        });
    });
    
    // Evaluate buttons in submission cards
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-page="evaluate-project"]')) {
            const button = e.target.closest('[data-page="evaluate-project"]');
            const submissionId = button.getAttribute('data-submission');
            if (submissionId) {
                localStorage.setItem('currentEvaluationSubmission', submissionId);
            }
        }
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggleTeacher');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTeacherTheme();
        });
    }
    
    // Logout
    document.querySelector('.logout').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            showTeacherNotification('Logged out successfully!');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
        }
    });
    
    // View all links
    document.querySelectorAll('.view-all[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            loadTeacherPage(page);
            
            document.querySelectorAll('.main-nav li').forEach(li => {
                li.classList.remove('active');
                if (li.getAttribute('data-page') === page) {
                    li.classList.add('active');
                }
            });
        });
    });
}

// Page Loading System
async function loadTeacherPage(page) {
    const contentArea = document.getElementById('pageContent');
    
    // Show loading state
    contentArea.innerHTML = `
        <div class="loading" style="text-align: center; padding: 50px;">
            <div class="spinner" style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="color: var(--gray-medium); font-size: 1.1rem;">Loading...</p>
        </div>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;
    
    try {
        let htmlContent = '';
        
        switch(page) {
            case 'dashboard':
                htmlContent = getTeacherDashboardContent();
                break;
            case 'assigned-groups':
                htmlContent = await getAssignedGroupsContent();
                break;
            case 'view-submissions':
                htmlContent = await getViewSubmissionsContent();
                break;
            case 'evaluate-project':
                htmlContent = await getEvaluateProjectContent();
                break;
            default:
                htmlContent = getTeacherDashboardContent();
        }
        
        contentArea.innerHTML = htmlContent;
        
        // Initialize page-specific scripts
        initTeacherPageScripts(page);
        
    } catch (error) {
        console.error('Error loading page:', error);
        contentArea.innerHTML = `
            <div class="error" style="text-align: center; padding: 50px;">
                <div style="background: linear-gradient(135deg, #DC3545 0%, #FF6B6B 100%); width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: white;"></i>
                </div>
                <h3 style="color: var(--danger-color); margin-bottom: 15px;">Error Loading Content</h3>
                <p style="color: var(--gray-medium); margin-bottom: 30px;">Please try again or contact support if the problem persists.</p>
                <button class="btn btn-primary" onclick="loadTeacherPage('dashboard')" style="padding: 12px 30px; border-radius: var(--border-radius-sm); background: var(--primary-color); color: white; border: none; cursor: pointer;">
                    <i class="fas fa-home"></i> Return to Dashboard
                </button>
            </div>
        `;
    }
}

// Page Content Functions
function getTeacherDashboardContent() {
    return `
        <div class="welcome-section">
            <h2>Welcome, Dr. Smith!</h2>
            <p>Manage your assigned student groups, review submissions, and evaluate projects from this dashboard.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>Assigned Groups</h3>
                    <p class="stat-number">3</p>
                    <p class="stat-detail">Total Students: 9</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <i class="fas fa-project-diagram"></i>
                </div>
                <div class="stat-info">
                    <h3>Active Projects</h3>
                    <p class="stat-number">2</p>
                    <p class="stat-detail">1 Pending Review</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h3>Pending Reviews</h3>
                    <p class="stat-number">1</p>
                    <p class="stat-detail">Due in 2 days</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <h3>Evaluated</h3>
                    <p class="stat-number">4</p>
                    <p class="stat-detail">This semester</p>
                </div>
            </div>
        </div>

        <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div class="actions-grid">
                <button class="action-btn" data-page="assigned-groups">
                    <i class="fas fa-eye"></i>
                    <span>View Assigned Groups</span>
                </button>
                <button class="action-btn" data-page="view-submissions">
                    <i class="fas fa-search"></i>
                    <span>Review Submissions</span>
                </button>
                <button class="action-btn" data-page="evaluate-project">
                    <i class="fas fa-edit"></i>
                    <span>Evaluate Project</span>
                </button>
                <button class="action-btn" onclick="sendAnnouncement()">
                    <i class="fas fa-bullhorn"></i>
                    <span>Send Announcement</span>
                </button>
            </div>
        </div>

        <div class="recent-submissions">
            <div class="section-header">
                <h3>Recent Submissions</h3>
                <a href="#" data-page="view-submissions" class="view-all">View All</a>
            </div>
            <div class="submissions-list">
                <div class="submission-card">
                    <div class="submission-header">
                        <h4>E-Commerce Platform</h4>
                        <span class="status-badge submitted">Submitted</span>
                    </div>
                    <div class="submission-body">
                        <p><strong>Group:</strong> Alpha Group (John, Jane, Bob)</p>
                        <p><strong>Submitted:</strong> 2 hours ago</p>
                        <p><strong>Files:</strong> 5 documents, 1 zip file</p>
                    </div>
                    <div class="submission-footer">
                        <button class="btn-small btn-primary" data-page="evaluate-project" data-submission="S001">
                            <i class="fas fa-check"></i> Evaluate Now
                        </button>
                        <button class="btn-small btn-secondary" onclick="viewSubmissionDetails('S001')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
                
                <div class="submission-card">
                    <div class="submission-header">
                        <h4>AI Chatbot System</h4>
                        <span class="status-badge pending">Pending</span>
                    </div>
                    <div class="submission-body">
                        <p><strong>Group:</strong> Beta Group (Alice, Charlie, Eve)</p>
                        <p><strong>Submitted:</strong> 1 day ago</p>
                        <p><strong>Deadline:</strong> 2 days left</p>
                    </div>
                    <div class="submission-footer">
                        <button class="btn-small btn-primary" data-page="evaluate-project" data-submission="S002">
                            <i class="fas fa-check"></i> Evaluate Now
                        </button>
                        <button class="btn-small btn-secondary" onclick="viewSubmissionDetails('S002')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="upcoming-deadlines">
            <div class="section-header">
                <h3>Upcoming Deadlines</h3>
                <a href="#" class="view-all">Calendar View</a>
            </div>
            <div class="deadline-list">
                <div class="deadline-item">
                    <div class="deadline-date">
                        <div class="day">15</div>
                        <div class="month">DEC</div>
                    </div>
                    <div class="deadline-details">
                        <h4>E-Commerce Platform - Final Submission</h4>
                        <p>Alpha Group • Computer Science</p>
                        <span class="deadline-time">7 days remaining</span>
                    </div>
                    <button class="btn-icon" title="Set Reminder">
                        <i class="fas fa-bell"></i>
                    </button>
                </div>
                
                <div class="deadline-item">
                    <div class="deadline-date">
                        <div class="day">20</div>
                        <div class="month">DEC</div>
                    </div>
                    <div class="deadline-details">
                        <h4>AI Chatbot - Progress Report</h4>
                        <p>Beta Group • Information Technology</p>
                        <span class="deadline-time">12 days remaining</span>
                    </div>
                    <button class="btn-icon" title="Set Reminder">
                        <i class="fas fa-bell"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function getAssignedGroupsContent() {
    const groups = await getTeacherAssignedGroups();
    
    return `
        <div class="section-header" style="margin-bottom: 30px;">
            <h2>My Assigned Groups</h2>
            <button class="btn btn-primary" onclick="exportGroupsList()">
                <i class="fas fa-download"></i> Export List
            </button>
        </div>
        
        <div class="groups-grid">
            ${groups.map(group => `
                <div class="group-card">
                    <div class="group-header">
                        <h3>${group.name}</h3>
                        <span class="status-badge ${group.status === 'Active' ? 'submitted' : 'pending'}">
                            ${group.status}
                        </span>
                    </div>
                    
                    <div class="group-info">
                        <div class="info-item">
                            <i class="fas fa-project-diagram"></i>
                            <span><strong>Project:</strong> ${group.project}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-calendar"></i>
                            <span><strong>Due Date:</strong> ${group.dueDate}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-university"></i>
                            <span><strong>Department:</strong> ${group.department}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-user-tie"></i>
                            <span><strong>Guide:</strong> ${group.guide}</span>
                        </div>
                    </div>
                    
                    <div class="members-list">
                        <h4>Group Members</h4>
                        ${group.members.map(member => `
                            <div class="member-item">
                                <img src="${member.avatar}" alt="${member.name}">
                                <div class="member-info">
                                    <h5>${member.name}</h5>
                                    <p>${member.role} • ${member.id}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="group-actions">
                        <button class="btn btn-secondary" onclick="viewGroupProgress('${group.id}')">
                            <i class="fas fa-chart-line"></i> Progress
                        </button>
                        <button class="btn btn-primary" onclick="contactGroup('${group.id}')">
                            <i class="fas fa-envelope"></i> Contact
                        </button>
                        <button class="btn btn-success" onclick="scheduleMeeting('${group.id}')">
                            <i class="fas fa-calendar-plus"></i> Meeting
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="summary-card" style="background: white; border-radius: var(--border-radius); padding: 30px; margin-top: 30px; box-shadow: var(--shadow);">
            <h3 style="color: var(--primary-color); margin-bottom: 20px;">Groups Summary</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary-color);">3</div>
                    <div style="color: var(--gray-medium);">Total Groups</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: 700; color: #28A745;">9</div>
                    <div style="color: var(--gray-medium);">Total Students</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: 700; color: #FFC107;">2</div>
                    <div style="color: var(--gray-medium);">Active Projects</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2.5rem; font-weight: 700; color: #17A2B8;">1</div>
                    <div style="color: var(--gray-medium);">Pending Reviews</div>
                </div>
            </div>
        </div>
    `;
}

async function getViewSubmissionsContent() {
    const submissions = await getAllSubmissions();
    
    return `
        <div class="section-header" style="margin-bottom: 30px;">
            <h2>All Submissions</h2>
            <div style="display: flex; gap: 15px;">
                <select id="filterSubmission" class="form-control" style="width: 200px;">
                    <option value="">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="pending">Pending Review</option>
                    <option value="graded">Graded</option>
                </select>
                <input type="text" id="searchSubmission" class="form-control" placeholder="Search submissions..." style="width: 250px;">
            </div>
        </div>
        
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Group</th>
                        <th>Submitted On</th>
                        <th>Status</th>
                        <th>Grade</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${submissions.map(submission => `
                        <tr>
                            <td>
                                <strong>${submission.project}</strong><br>
                                <small style="color: var(--gray-medium);">${submission.type}</small>
                            </td>
                            <td>
                                <strong>${submission.group}</strong><br>
                                <small style="color: var(--gray-medium);">${submission.department}</small>
                            </td>
                            <td>${submission.date}</td>
                            <td>
                                <span class="status-badge ${submission.status === 'Graded' ? 'graded' : submission.status === 'Submitted' ? 'submitted' : 'pending'}">
                                    ${submission.status}
                                </span>
                            </td>
                            <td>
                                ${submission.grade ? 
                                    `<span style="font-weight: 700; color: var(--primary-color);">${submission.grade}</span>` : 
                                    '<span style="color: var(--gray-medium);">-</span>'
                                }
                            </td>
                            <td>
                                <div style="display: flex; gap: 8px;">
                                    <button class="btn-icon" title="View Submission" style="background: var(--info-color);" onclick="viewSubmissionDetails('${submission.id}')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-icon" title="Evaluate" style="background: var(--primary-color);" onclick="startEvaluation('${submission.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-icon" title="Download Files" style="background: var(--success-color);" onclick="downloadSubmission('${submission.id}')">
                                        <i class="fas fa-download"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center;">
            <div style="color: var(--gray-medium);">
                Showing ${submissions.length} of ${submissions.length} submissions
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-secondary">
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
                <span style="padding: 10px 20px; background: var(--gray-light); border-radius: var(--border-radius-sm);">
                    Page 1 of 1
                </span>
                <button class="btn btn-secondary">
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;
}

async function getEvaluateProjectContent() {
    const submissionId = localStorage.getItem('currentEvaluationSubmission') || 'S001';
    const submission = await getSubmissionDetails(submissionId);
    
    return `
        <div class="form-container">
            <h2>Evaluate Project Submission</h2>
            
            <div class="submission-info" style="background: var(--gray-light); border-radius: var(--border-radius-sm); padding: 25px; margin-bottom: 30px;">
                <h3 style="color: var(--primary-color); margin-bottom: 15px;">Submission Details</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div>
                        <label style="color: var(--gray-medium); font-size: 0.9rem;">Project</label>
                        <p style="font-weight: 600; font-size: 1.1rem;">${submission.project}</p>
                    </div>
                    <div>
                        <label style="color: var(--gray-medium); font-size: 0.9rem;">Group</label>
                        <p style="font-weight: 600; font-size: 1.1rem;">${submission.group}</p>
                    </div>
                    <div>
                        <label style="color: var(--gray-medium); font-size: 0.9rem;">Submitted On</label>
                        <p style="font-weight: 600; font-size: 1.1rem;">${submission.date}</p>
                    </div>
                    <div>
                        <label style="color: var(--gray-medium); font-size: 0.9rem;">Files</label>
                        <p style="font-weight: 600; font-size: 1.1rem;">${submission.files} files</p>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="viewSubmissionDetails('${submission.id}')" style="margin-top: 15px;">
                    <i class="fas fa-external-link-alt"></i> View Full Submission
                </button>
            </div>
            
            <form id="evaluateProjectForm">
                <div class="evaluation-criteria">
                    <h3 style="color: var(--primary-color); margin-bottom: 20px;">Evaluation Criteria</h3>
                    
                    <div class="criteria-item">
                        <div class="criteria-header">
                            <h4>Project Requirements (30 points)</h4>
                            <span class="criteria-points" id="requirementsScore">0</span>
                        </div>
                        <div class="slider-container">
                            <span class="slider-value" id="requirementsValue">0</span>
                            <input type="range" min="0" max="30" value="0" class="slider" id="requirementsSlider" oninput="updateSliderValue(this)">
                        </div>
                    </div>
                    
                    <div class="criteria-item">
                        <div class="criteria-header">
                            <h4>Code Quality (25 points)</h4>
                            <span class="criteria-points" id="codeQualityScore">0</span>
                        </div>
                        <div class="slider-container">
                            <span class="slider-value" id="codeQualityValue">0</span>
                            <input type="range" min="0" max="25" value="0" class="slider" id="codeQualitySlider" oninput="updateSliderValue(this)">
                        </div>
                    </div>
                    
                    <div class="criteria-item">
                        <div class="criteria-header">
                            <h4>Documentation (20 points)</h4>
                            <span class="criteria-points" id="documentationScore">0</span>
                        </div>
                        <div class="slider-container">
                            <span class="slider-value" id="documentationValue">0</span>
                            <input type="range" min="0" max="20" value="0" class="slider" id="documentationSlider" oninput="updateSliderValue(this)">
                        </div>
                    </div>
                    
                    <div class="criteria-item">
                        <div class="criteria-header">
                            <h4>Creativity & Innovation (15 points)</h4>
                            <span class="criteria-points" id="creativityScore">0</span>
                        </div>
                        <div class="slider-container">
                            <span class="slider-value" id="creativityValue">0</span>
                            <input type="range" min="0" max="15" value="0" class="slider" id="creativitySlider" oninput="updateSliderValue(this)">
                        </div>
                    </div>
                    
                    <div class="criteria-item">
                        <div class="criteria-header">
                            <h4>Presentation (10 points)</h4>
                            <span class="criteria-points" id="presentationScore">0</span>
                        </div>
                        <div class="slider-container">
                            <span class="slider-value" id="presentationValue">0</span>
                            <input type="range" min="0" max="10" value="0" class="slider" id="presentationSlider" oninput="updateSliderValue(this)">
                        </div>
                    </div>
                    
                    <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--gray-medium);">
                        <h3 style="color: var(--primary-color);">
                            Total Score: <span id="totalScore">0</span> / 100
                        </h3>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="grade">Final Grade *</label>
                    <select id="grade" class="form-control" required>
                        <option value="">Select Grade</option>
                        <option value="A">A (90-100)</option>
                        <option value="B">B (80-89)</option>
                        <option value="C">C (70-79)</option>
                        <option value="D">D (60-69)</option>
                        <option value="F">F (Below 60)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="feedback">Detailed Feedback *</label>
                    <textarea id="feedback" class="form-control" rows="6" required placeholder="Provide detailed feedback about the project, including strengths, areas for improvement, and specific comments..."></textarea>
                </div>
                
                <div class="form-group">
                    <label for="additionalComments">Additional Comments (Optional)</label>
                    <textarea id="additionalComments" class="form-control" rows="3" placeholder="Any additional comments or notes..."></textarea>
                </div>
                
                <div class="form-group">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" id="notifyStudents" checked>
                        <label for="notifyStudents" style="margin: 0;">Notify students about this evaluation</label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="resetEvaluationForm()">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                    <button type="button" class="btn btn-primary" onclick="saveAsDraft()">
                        <i class="fas fa-save"></i> Save as Draft
                    </button>
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-check-circle"></i> Submit Evaluation
                    </button>
                </div>
            </form>
        </div>
    `;
}

// Initialize page-specific scripts
function initTeacherPageScripts(page) {
    switch(page) {
        case 'assigned-groups':
            initAssignedGroupsPage();
            break;
        case 'view-submissions':
            initViewSubmissionsPage();
            break;
        case 'evaluate-project':
            initEvaluateProjectPage();
            break;
    }
    
    // Re-attach event listeners for action buttons
    document.querySelectorAll('.action-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            loadTeacherPage(page);
            
            document.querySelectorAll('.main-nav li').forEach(li => {
                li.classList.remove('active');
                if (li.getAttribute('data-page') === page) {
                    li.classList.add('active');
                }
            });
        });
    });
    
    // Re-attach evaluate button listeners
    document.querySelectorAll('[data-page="evaluate-project"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const submissionId = this.getAttribute('data-submission');
            if (submissionId) {
                localStorage.setItem('currentEvaluationSubmission', submissionId);
            }
        });
    });
}

function initAssignedGroupsPage() {
    // Setup filter and search for groups
    const filterInput = document.getElementById('filterSubmission');
    const searchInput = document.getElementById('searchSubmission');
    
    if (filterInput) {
        filterInput.addEventListener('change', function() {
            filterSubmissions();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterSubmissions();
        });
    }
}

function initViewSubmissionsPage() {
    // Setup filter and search for submissions
    const filterInput = document.getElementById('filterSubmission');
    const searchInput = document.getElementById('searchSubmission');
    
    if (filterInput) {
        filterInput.addEventListener('change', function() {
            filterSubmissions();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterSubmissions();
        });
    }
}

function initEvaluateProjectPage() {
    const form = document.getElementById('evaluateProjectForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitEvaluation();
        });
        
        // Initialize sliders
        initializeSliders();
    }
}

// Slider Functions
function initializeSliders() {
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        updateSliderValue(slider);
    });
    updateTotalScore();
}

function updateSliderValue(slider) {
    const value = slider.value;
    const sliderId = slider.id;
    const criteria = sliderId.replace('Slider', '');
    
    // Update display value
    const valueElement = document.getElementById(`${criteria}Value`);
    if (valueElement) {
        valueElement.textContent = value;
    }
    
    // Update criteria score
    const scoreElement = document.getElementById(`${criteria}Score`);
    if (scoreElement) {
        scoreElement.textContent = value;
    }
    
    updateTotalScore();
}

function updateTotalScore() {
    const criteria = ['requirements', 'codeQuality', 'documentation', 'creativity', 'presentation'];
    let total = 0;
    
    criteria.forEach(criterion => {
        const slider = document.getElementById(`${criterion}Slider`);
        if (slider) {
            total += parseInt(slider.value);
        }
    });
    
    const totalScoreElement = document.getElementById('totalScore');
    if (totalScoreElement) {
        totalScoreElement.textContent = total;
        
        // Auto-select grade based on total score
        const gradeSelect = document.getElementById('grade');
        if (gradeSelect) {
            if (total >= 90) gradeSelect.value = 'A';
            else if (total >= 80) gradeSelect.value = 'B';
            else if (total >= 70) gradeSelect.value = 'C';
            else if (total >= 60) gradeSelect.value = 'D';
            else gradeSelect.value = 'F';
        }
    }
}

// Form Functions
function resetEvaluationForm() {
    const form = document.getElementById('evaluateProjectForm');
    if (form) {
        form.reset();
        
        // Reset sliders
        const sliders = document.querySelectorAll('.slider');
        sliders.forEach(slider => {
            slider.value = 0;
            updateSliderValue(slider);
        });
        
        showTeacherNotification('Evaluation form has been reset');
    }
}

function saveAsDraft() {
    const evaluationData = {
        submissionId: localStorage.getItem('currentEvaluationSubmission'),
        scores: {
            requirements: parseInt(document.getElementById('requirementsSlider').value),
            codeQuality: parseInt(document.getElementById('codeQualitySlider').value),
            documentation: parseInt(document.getElementById('documentationSlider').value),
            creativity: parseInt(document.getElementById('creativitySlider').value),
            presentation: parseInt(document.getElementById('presentationSlider').value)
        },
        totalScore: parseInt(document.getElementById('totalScore').textContent),
        grade: document.getElementById('grade').value,
        feedback: document.getElementById('feedback').value,
        additionalComments: document.getElementById('additionalComments').value,
        notifyStudents: document.getElementById('notifyStudents').checked
    };
    
    // Save to localStorage
    localStorage.setItem('evaluationDraft', JSON.stringify(evaluationData));
    showTeacherNotification('Evaluation saved as draft successfully!', 'info');
}

function submitEvaluation() {
    const evaluationData = {
        submissionId: localStorage.getItem('currentEvaluationSubmission'),
        scores: {
            requirements: parseInt(document.getElementById('requirementsSlider').value),
            codeQuality: parseInt(document.getElementById('codeQualitySlider').value),
            documentation: parseInt(document.getElementById('documentationSlider').value),
            creativity: parseInt(document.getElementById('creativitySlider').value),
            presentation: parseInt(document.getElementById('presentationSlider').value)
        },
        totalScore: parseInt(document.getElementById('totalScore').textContent),
        grade: document.getElementById('grade').value,
        feedback: document.getElementById('feedback').value,
        additionalComments: document.getElementById('additionalComments').value,
        notifyStudents: document.getElementById('notifyStudents').checked,
        evaluatedBy: 'Dr. Smith',
        evaluationDate: new Date().toLocaleDateString()
    };
    
    // Validate
    if (!evaluationData.grade) {
        showTeacherNotification('Please select a grade', 'warning');
        return;
    }
    
    if (!evaluationData.feedback.trim()) {
        showTeacherNotification('Please provide detailed feedback', 'warning');
        return;
    }
    
    // Simulate submission
    showTeacherNotification('Submitting evaluation...', 'info');
    
    setTimeout(() => {
        // Clear draft
        localStorage.removeItem('evaluationDraft');
        localStorage.removeItem('currentEvaluationSubmission');
        
        showTeacherNotification('Evaluation submitted successfully! Students have been notified.', 'success');
        
        // Redirect to view submissions after 2 seconds
        setTimeout(() => {
            loadTeacherPage('view-submissions');
            document.querySelectorAll('.main-nav li').forEach(li => {
                li.classList.remove('active');
                if (li.getAttribute('data-page') === 'view-submissions') {
                    li.classList.add('active');
                }
            });
        }, 2000);
    }, 1500);
}

// Action Functions
function sendAnnouncement() {
    const announcement = prompt('Enter announcement for your students:');
    if (announcement && announcement.trim()) {
        // Simulate sending announcement
        setTimeout(() => {
            showTeacherNotification('Announcement sent to all assigned groups!');
        }, 500);
    }
}

function viewSubmissionDetails(submissionId) {
    showTeacherNotification(`Loading submission ${submissionId}...`, 'info');
    
    // In a real app, this would open a modal or navigate to a detail page
    setTimeout(() => {
        const submission = {
            id: submissionId,
            project: 'E-Commerce Platform',
            group: 'Alpha Group',
            date: 'December 5, 2023',
            files: ['project_documentation.pdf', 'source_code.zip', 'presentation.pptx'],
            description: 'Complete e-commerce platform with user authentication, product catalog, shopping cart, and payment integration.'
        };
        
        alert(`Submission Details:\n\n` +
              `Project: ${submission.project}\n` +
              `Group: ${submission.group}\n` +
              `Submitted: ${submission.date}\n` +
              `Files: ${submission.files.join(', ')}\n\n` +
              `Description: ${submission.description}`);
    }, 500);
}

function viewGroupProgress(groupId) {
    showTeacherNotification(`Loading progress for group ${groupId}...`, 'info');
    
    // In a real app, this would show progress charts
    setTimeout(() => {
        alert(`Group Progress:\n\n` +
              `Project Completion: 75%\n` +
              `Milestones: 4/5 completed\n` +
              `Last Update: 2 days ago\n` +
              `Status: On track\n` +
              `Estimated Completion: 90% by deadline`);
    }, 500);
}

function contactGroup(groupId) {
    const message = prompt(`Enter message for group ${groupId}:`);
    if (message && message.trim()) {
        // Simulate sending message
        setTimeout(() => {
            showTeacherNotification(`Message sent to group ${groupId}!`);
        }, 500);
    }
}

function scheduleMeeting(groupId) {
    const date = prompt('Enter meeting date (YYYY-MM-DD):');
    const time = prompt('Enter meeting time (HH:MM):');
    
    if (date && time) {
        // Simulate scheduling
        setTimeout(() => {
            showTeacherNotification(`Meeting scheduled for group ${groupId} on ${date} at ${time}!`);
        }, 500);
    }
}

function exportGroupsList() {
    showTeacherNotification('Exporting groups list...', 'info');
    setTimeout(() => {
        showTeacherNotification('Groups list exported successfully!', 'success');
    }, 1500);
}

function startEvaluation(submissionId) {
    localStorage.setItem('currentEvaluationSubmission', submissionId);
    loadTeacherPage('evaluate-project');
    document.querySelectorAll('.main-nav li').forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('data-page') === 'evaluate-project') {
            li.classList.add('active');
        }
    });
}

function downloadSubmission(submissionId) {
    showTeacherNotification(`Downloading submission ${submissionId}...`, 'info');
    setTimeout(() => {
        showTeacherNotification('Download completed!', 'success');
    }, 1500);
}

function filterSubmissions() {
    const filterValue = document.getElementById('filterSubmission')?.value || '';
    const searchValue = document.getElementById('searchSubmission')?.value.toLowerCase() || '';
    
    console.log('Filtering submissions:', { filterValue, searchValue });
    // In a real app, this would filter the table rows
}

// Utility Functions
function showTeacherNotification(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    const toastContent = toast.querySelector('.toast-content');
    
    // Update toast content based on type
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'info': 'fa-info-circle',
        'warning': 'fa-exclamation-triangle'
    };
    
    const colors = {
        'success': 'var(--success-color)',
        'error': 'var(--danger-color)',
        'info': 'var(--info-color)',
        'warning': 'var(--warning-color)'
    };
    
    toastContent.innerHTML = `<i class="fas ${icons[type] || icons.success}"></i><p>${message}</p>`;
    toast.style.background = colors[type] || colors.success;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Mock Data Functions (Replace with actual API calls)
async function getTeacherAssignedGroups() {
    return [
        {
            id: 'G001',
            name: 'Alpha Group',
            project: 'E-Commerce Platform',
            dueDate: 'December 15, 2023',
            department: 'Computer Science',
            guide: 'Dr. Smith',
            status: 'Active',
            members: [
                {
                    name: 'John Doe',
                    role: 'Group Leader',
                    id: 'CS2023001',
                    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4FC3A1&color=fff'
                },
                {
                    name: 'Jane Smith',
                    role: 'Developer',
                    id: 'CS2023002',
                    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=667eea&color=fff'
                },
                {
                    name: 'Bob Johnson',
                    role: 'Designer',
                    id: 'CS2023003',
                    avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=FF7E5F&color=fff'
                }
            ]
        },
        {
            id: 'G002',
            name: 'Beta Group',
            project: 'AI Chatbot System',
            dueDate: 'December 20, 2023',
            department: 'Information Technology',
            guide: 'Dr. Smith',
            status: 'Active',
            members: [
                {
                    name: 'Alice Brown',
                    role: 'Group Leader',
                    id: 'IT2023001',
                    avatar: 'https://ui-avatars.com/api/?name=Alice+Brown&background=4A6FA5&color=fff'
                },
                {
                    name: 'Charlie Davis',
                    role: 'AI Developer',
                    id: 'IT2023002',
                    avatar: 'https://ui-avatars.com/api/?name=Charlie+Davis&background=43e97b&color=fff'
                },
                {
                    name: 'Eve Wilson',
                    role: 'Data Analyst',
                    id: 'IT2023003',
                    avatar: 'https://ui-avatars.com/api/?name=Eve+Wilson&background=f093fb&color=fff'
                }
            ]
        },
        {
            id: 'G003',
            name: 'Gamma Group',
            project: 'IoT Home Automation',
            dueDate: 'December 10, 2023',
            department: 'Electronics Engineering',
            guide: 'Dr. Smith',
            status: 'Completed',
            members: [
                {
                    name: 'Mike Taylor',
                    role: 'Group Leader',
                    id: 'EE2023001',
                    avatar: 'https://ui-avatars.com/api/?name=Mike+Taylor&background=4facfe&color=fff'
                },
                {
                    name: 'Sarah Clark',
                    role: 'Hardware Engineer',
                    id: 'EE2023002',
                    avatar: 'https://ui-avatars.com/api/?name=Sarah+Clark&background=FFD700&color=000'
                },
                {
                    name: 'Tom Harris',
                    role: 'Software Engineer',
                    id: 'EE2023003',
                    avatar: 'https://ui-avatars.com/api/?name=Tom+Harris&background=764ba2&color=fff'
                }
            ]
        }
    ];
}

async function getAllSubmissions() {
    return [
        {
            id: 'S001',
            project: 'E-Commerce Platform',
            type: 'Final Submission',
            group: 'Alpha Group',
            department: 'Computer Science',
            date: 'Dec 5, 2023',
            status: 'Submitted',
            grade: null
        },
        {
            id: 'S002',
            project: 'AI Chatbot System',
            type: 'Progress Report',
            group: 'Beta Group',
            department: 'Information Technology',
            date: 'Dec 4, 2023',
            status: 'Pending Review',
            grade: null
        },
        {
            id: 'S003',
            project: 'IoT Home Automation',
            type: 'Final Submission',
            group: 'Gamma Group',
            department: 'Electronics Engineering',
            date: 'Dec 1, 2023',
            status: 'Graded',
            grade: 'A'
        },
        {
            id: 'S004',
            project: 'Mobile Banking App',
            type: 'Design Phase',
            group: 'Delta Group',
            department: 'Computer Science',
            date: 'Nov 28, 2023',
            status: 'Graded',
            grade: 'B+'
        }
    ];
}

async function getSubmissionDetails(submissionId) {
    const submissions = {
        'S001': {
            id: 'S001',
            project: 'E-Commerce Platform',
            group: 'Alpha Group',
            date: 'December 5, 2023',
            files: 6,
            description: 'Complete e-commerce platform with all required features implemented.'
        },
        'S002': {
            id: 'S002',
            project: 'AI Chatbot System',
            group: 'Beta Group',
            date: 'December 4, 2023',
            files: 4,
            description: 'Progress report for AI chatbot project with current implementation status.'
        }
    };
    
    return submissions[submissionId] || submissions['S001'];
}