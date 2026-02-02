// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeStudentApp();
});

function initializeStudentApp() {
    // Set current date
    updateCurrentDate();
    
    // Load initial page
    loadStudentPage('dashboard');
    
    // Setup event listeners
    setupStudentEventListeners();
    
    // Initialize theme from localStorage
    initStudentTheme();
}

// Theme Management
function initStudentTheme() {
    const savedTheme = localStorage.getItem('studentTheme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateStudentThemeToggleButton();
    }
}

function toggleStudentTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('studentTheme', isDark ? 'dark' : 'light');
    updateStudentThemeToggleButton();
}

function updateStudentThemeToggleButton() {
    const themeToggle = document.getElementById('themeToggleStudent');
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
function setupStudentEventListeners() {
    // Navigation menu clicks
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.parentElement.getAttribute('data-page');
            loadStudentPage(page);
            
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
            loadStudentPage(page);
            
            // Update active state
            document.querySelectorAll('.main-nav li').forEach(li => {
                li.classList.remove('active');
                if (li.getAttribute('data-page') === page) {
                    li.classList.add('active');
                }
            });
        });
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggleStudent');
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleStudentTheme();
        });
    }
    
    // Logout
    document.querySelector('.logout').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            showStudentNotification('Logged out successfully!');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
        }
    });
    
    // File upload handler
    document.addEventListener('change', function(e) {
        if (e.target.type === 'file') {
            handleFileUpload(e.target);
        }
    });
}

// Page Loading System
async function loadStudentPage(page) {
    const contentArea = document.getElementById('pageContent');
    
    // Show loading state
    contentArea.innerHTML = `
        <div class="loading" style="text-align: center; padding: 50px;">
            <div class="spinner" style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p>Loading...</p>
        </div>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;
    
    try {
        let htmlContent = '';
        
        switch(page) {
            case 'dashboard':
                htmlContent = getStudentDashboardContent();
                break;
            case 'view-project':
                htmlContent = await getViewProjectContent();
                break;
            case 'submit-project':
                htmlContent = await getSubmitProjectContent();
                break;
            case 'submission-status':
                htmlContent = await getSubmissionStatusContent();
                break;
            default:
                htmlContent = getStudentDashboardContent();
        }
        
        contentArea.innerHTML = htmlContent;
        
        // Initialize page-specific scripts
        initStudentPageScripts(page);
        
    } catch (error) {
        console.error('Error loading page:', error);
        contentArea.innerHTML = `
            <div class="error" style="text-align: center; padding: 50px; color: var(--danger-color);">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>Error loading content</h3>
                <p>Please try again or contact support if the problem persists.</p>
                <button class="btn btn-primary" onclick="loadStudentPage('dashboard')">
                    <i class="fas fa-home"></i> Return to Dashboard
                </button>
            </div>
        `;
    }
}

// Page Content Functions
function getStudentDashboardContent() {
    return `
        <div class="welcome-section">
            <h2>Welcome back, John!</h2>
            <p>Here's an overview of your current project status and upcoming deadlines.</p>
        </div>

        <div class="stats-overview">
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <i class="fas fa-tasks"></i>
                </div>
                <div class="stat-info">
                    <h3>Current Project</h3>
                    <p class="stat-number">E-Commerce Platform</p>
                    <p class="stat-detail">Due in 7 days</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div class="stat-info">
                    <h3>Project Guide</h3>
                    <p class="stat-number">Dr. Smith</p>
                    <p class="stat-detail">Computer Science Dept.</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>Group Members</h3>
                    <p class="stat-number">3 Members</p>
                    <p class="stat-detail">John, Jane, Bob</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-info">
                    <h3>Submission Status</h3>
                    <p class="stat-number">Pending</p>
                    <p class="stat-detail">Not submitted yet</p>
                </div>
            </div>
        </div>

        <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div class="actions-grid">
                <button class="action-btn" data-page="view-project">
                    <i class="fas fa-eye"></i>
                    <span>View Project Details</span>
                </button>
                <button class="action-btn" data-page="submit-project">
                    <i class="fas fa-upload"></i>
                    <span>Submit Project</span>
                </button>
                <button class="action-btn" onclick="viewGuideContact()">
                    <i class="fas fa-comments"></i>
                    <span>Contact Guide</span>
                </button>
                <button class="action-btn" onclick="downloadResources()">
                    <i class="fas fa-download"></i>
                    <span>Download Resources</span>
                </button>
            </div>
        </div>

        <div class="deadlines-section">
            <div class="section-header">
                <h3>Upcoming Deadlines</h3>
                <a href="#" class="view-all">View All</a>
            </div>
            <div class="deadline-list">
                <div class="deadline-item urgent">
                    <div class="deadline-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="deadline-content">
                        <h4>Project Submission</h4>
                        <p>E-Commerce Platform - Final Submission</p>
                        <span class="deadline-time">Due: Dec 15, 2023 (7 days left)</span>
                    </div>
                </div>
                <div class="deadline-item">
                    <div class="deadline-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <div class="deadline-content">
                        <h4>Progress Report</h4>
                        <p>Submit weekly progress report to guide</p>
                        <span class="deadline-time">Due: Dec 8, 2023 (Tomorrow)</span>
                    </div>
                </div>
                <div class="deadline-item">
                    <div class="deadline-icon">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div class="deadline-content">
                        <h4>Guide Meeting</h4>
                        <p>Weekly meeting with Dr. Smith</p>
                        <span class="deadline-time">Dec 10, 2023 (3 days left)</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="activity-section">
            <h3>Recent Activity</h3>
            <div class="activity-timeline">
                <div class="timeline-item">
                    <div class="timeline-icon success">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="timeline-content">
                        <p>Project requirements reviewed and approved</p>
                        <span class="timeline-time">2 days ago</span>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon info">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <div class="timeline-content">
                        <p>Guide provided feedback on initial design</p>
                        <span class="timeline-time">4 days ago</span>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon warning">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="timeline-content">
                        <p>Reminder: Progress report due this week</p>
                        <span class="timeline-time">5 days ago</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function getViewProjectContent() {
    const project = await getCurrentProject();
    
    return `
        <div class="project-details">
            <div class="detail-section">
                <h3>Project Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Project ID</label>
                        <div class="value">${project.id}</div>
                    </div>
                    <div class="detail-item">
                        <label>Project Title</label>
                        <div class="value">${project.title}</div>
                    </div>
                    <div class="detail-item">
                        <label>Department</label>
                        <div class="value">${project.department}</div>
                    </div>
                    <div class="detail-item">
                        <label>Due Date</label>
                        <div class="value">${project.dueDate}</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Project Description</h3>
                <div class="detail-item">
                    <p style="line-height: 1.6; color: var(--dark-color);">${project.description}</p>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Guide Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Guide Name</label>
                        <div class="value">${project.guideName}</div>
                    </div>
                    <div class="detail-item">
                        <label>Department</label>
                        <div class="value">${project.guideDepartment}</div>
                    </div>
                    <div class="detail-item">
                        <label>Email</label>
                        <div class="value">${project.guideEmail}</div>
                    </div>
                    <div class="detail-item">
                        <label>Contact</label>
                        <div class="value">${project.guideContact}</div>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Group Information</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Group Leader</label>
                        <div class="value">${project.groupLeader}</div>
                    </div>
                    <div class="detail-item">
                        <label>Group Members</label>
                        <div class="value">${project.groupMembers.join(', ')}</div>
                    </div>
                    <div class="detail-item">
                        <label>Division</label>
                        <div class="value">${project.division}</div>
                    </div>
                    <div class="detail-item">
                        <label>Status</label>
                        <div class="value">
                            <span class="status-badge" style="background: #FFF3CD; color: #856404; padding: 5px 12px; border-radius: 20px; font-size: 0.9rem;">
                                ${project.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-secondary" onclick="downloadProjectBrief()">
                    <i class="fas fa-download"></i> Download Brief
                </button>
                <button class="btn btn-primary" data-page="submit-project">
                    <i class="fas fa-upload"></i> Submit Project
                </button>
            </div>
        </div>
    `;
}

async function getSubmitProjectContent() {
    const project = await getCurrentProject();
    
    return `
        <div class="form-container">
            <h2>Submit Project</h2>
            <form id="submitProjectForm">
                <div class="form-group">
                    <label for="projectTitle">Project Title</label>
                    <input type="text" id="projectTitle" class="form-control" 
                           value="${project.title}" readonly>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="groupName">Group Name</label>
                        <input type="text" id="groupName" class="form-control" 
                               value="Alpha Group" readonly>
                    </div>
                    <div class="form-group">
                        <label for="guideName">Guide Name</label>
                        <input type="text" id="guideName" class="form-control" 
                               value="${project.guideName}" readonly>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="submissionNotes">Submission Notes (Optional)</label>
                    <textarea id="submissionNotes" class="form-control" rows="4" 
                              placeholder="Add any additional notes or comments about your submission..."></textarea>
                </div>
                
                <div class="form-group">
                    <label>Upload Project Files *</label>
                    <div class="file-upload" id="fileUploadArea">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <h4>Drag & Drop Files Here</h4>
                        <p>or click to browse</p>
                        <p class="upload-info">Accepted formats: .zip, .pdf, .doc, .ppt, .jpg, .png</p>
                        <p class="upload-info">Max file size: 100MB</p>
                        <input type="file" id="projectFiles" multiple accept=".zip,.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png">
                    </div>
                    <div id="fileList" style="margin-top: 15px;"></div>
                </div>
                
                <div class="form-group">
                    <label for="githubLink">GitHub Repository Link (Optional)</label>
                    <input type="url" id="githubLink" class="form-control" 
                           placeholder="https://github.com/username/project">
                </div>
                
                <div class="form-group">
                    <label for="liveDemo">Live Demo Link (Optional)</label>
                    <input type="url" id="liveDemo" class="form-control" 
                           placeholder="https://demo.example.com">
                </div>
                
                <div class="form-group">
                    <div class="checkbox-group">
                        <input type="checkbox" id="termsAgreement" required>
                        <label for="termsAgreement">
                            I confirm that this submission is our original work and complies with academic integrity policies.
                        </label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="resetForm('submitProjectForm')">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Submit Project
                    </button>
                </div>
            </form>
        </div>
    `;
}

async function getSubmissionStatusContent() {
    const submissions = await getStudentSubmissions();
    
    return `
        <div class="status-cards">
            <div class="status-card">
                <div class="status-icon pending">
                    <i class="fas fa-clock"></i>
                </div>
                <h3>Current Submission</h3>
                <p>E-Commerce Platform</p>
                <p><strong>Status:</strong> Not Submitted</p>
                <p><strong>Due Date:</strong> Dec 15, 2023</p>
                <button class="btn btn-primary" data-page="submit-project" style="margin-top: 15px;">
                    <i class="fas fa-upload"></i> Submit Now
                </button>
            </div>
            
            <div class="status-card">
                <div class="status-icon submitted">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Previous Submissions</h3>
                ${submissions.map(submission => `
                    <div style="text-align: left; margin: 15px 0; padding: 15px; background: var(--gray-light); border-radius: 8px;">
                        <p><strong>${submission.title}</strong></p>
                        <p>Submitted: ${submission.date}</p>
                        <p>Status: 
                            <span class="status-badge" style="background: ${submission.status === 'Graded' ? '#D4EDDA' : '#D1ECF1'}; color: ${submission.status === 'Graded' ? '#155724' : '#0C5460'}; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem;">
                                ${submission.status}
                            </span>
                        </p>
                        ${submission.grade ? `<p>Grade: <strong>${submission.grade}</strong></p>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="form-container" style="margin-top: 30px;">
            <h3>Submission History</h3>
            <div class="table-responsive">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); color: white;">
                            <th style="padding: 15px; text-align: left;">Project</th>
                            <th style="padding: 15px; text-align: left;">Submission Date</th>
                            <th style="padding: 15px; text-align: left;">Status</th>
                            <th style="padding: 15px; text-align: left;">Grade</th>
                            <th style="padding: 15px; text-align: left;">Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${submissions.map(submission => `
                            <tr style="border-bottom: 1px solid var(--gray-light);">
                                <td style="padding: 15px;">${submission.title}</td>
                                <td style="padding: 15px;">${submission.date}</td>
                                <td style="padding: 15px;">
                                    <span class="status-badge" style="background: ${submission.status === 'Graded' ? '#D4EDDA' : '#D1ECF1'}; color: ${submission.status === 'Graded' ? '#155724' : '#0C5460'}; padding: 5px 12px; border-radius: 20px; font-size: 0.85rem;">
                                        ${submission.status}
                                    </span>
                                </td>
                                <td style="padding: 15px;">${submission.grade || '-'}</td>
                                <td style="padding: 15px;">
                                    ${submission.feedback ? 
                                        `<button class="btn-icon btn-view" onclick="viewFeedback('${submission.id}')" style="background: var(--info-color); color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer;">
                                            <i class="fas fa-eye"></i>
                                        </button>` : 
                                        '-'
                                    }
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Initialize page-specific scripts
function initStudentPageScripts(page) {
    switch(page) {
        case 'submit-project':
            initSubmitProjectForm();
            break;
        case 'view-project':
            initViewProjectPage();
            break;
        case 'submission-status':
            initSubmissionStatusPage();
            break;
    }
    
    // Re-attach event listeners for action buttons
    document.querySelectorAll('.action-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            loadStudentPage(page);
            
            document.querySelectorAll('.main-nav li').forEach(li => {
                li.classList.remove('active');
                if (li.getAttribute('data-page') === page) {
                    li.classList.add('active');
                }
            });
        });
    });
}

// Form Initialization Functions
function initSubmitProjectForm() {
    const form = document.getElementById('submitProjectForm');
    const fileUploadArea = document.getElementById('fileUploadArea');
    
    if (fileUploadArea) {
        fileUploadArea.addEventListener('click', function() {
            document.getElementById('projectFiles').click();
        });
        
        // Drag and drop functionality
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        fileUploadArea.addEventListener('drop', handleDrop, false);
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate files
            const fileInput = document.getElementById('projectFiles');
            if (fileInput.files.length === 0) {
                showStudentNotification('Please upload at least one project file', 'warning');
                return;
            }
            
            // Validate terms agreement
            const termsAgreed = document.getElementById('termsAgreement').checked;
            if (!termsAgreed) {
                showStudentNotification('Please agree to the terms before submitting', 'warning');
                return;
            }
            
            // Collect form data
            const submissionData = {
                projectTitle: document.getElementById('projectTitle').value,
                notes: document.getElementById('submissionNotes').value,
                githubLink: document.getElementById('githubLink').value,
                liveDemo: document.getElementById('liveDemo').value,
                files: Array.from(fileInput.files).map(file => ({
                    name: file.name,
                    size: formatFileSize(file.size),
                    type: file.type
                }))
            };
            
            // Simulate submission
            showStudentNotification('Submitting project...', 'info');
            
            setTimeout(() => {
                showStudentNotification('Project submitted successfully!', 'success');
                resetForm('submitProjectForm');
                document.getElementById('fileList').innerHTML = '';
                
                // Redirect to status page after 2 seconds
                setTimeout(() => {
                    loadStudentPage('submission-status');
                    document.querySelectorAll('.main-nav li').forEach(li => {
                        li.classList.remove('active');
                        if (li.getAttribute('data-page') === 'submission-status') {
                            li.classList.add('active');
                        }
                    });
                }, 2000);
            }, 2000);
        });
    }
}

function initViewProjectPage() {
    // Any specific initialization for view project page
    console.log('View project page initialized');
}

function initSubmissionStatusPage() {
    // Any specific initialization for submission status page
    console.log('Submission status page initialized');
}

// File Upload Functions
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    fileUploadArea.style.borderColor = 'var(--primary-color)';
    fileUploadArea.style.backgroundColor = 'rgba(79, 195, 161, 0.1)';
}

function unhighlight() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    fileUploadArea.style.borderColor = '';
    fileUploadArea.style.backgroundColor = '';
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    document.getElementById('projectFiles').files = files;
    handleFileUpload(document.getElementById('projectFiles'));
}

function handleFileUpload(input) {
    const fileList = document.getElementById('fileList');
    if (!fileList) return;
    
    fileList.innerHTML = '';
    
    Array.from(input.files).forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            margin-bottom: 10px;
            background: var(--gray-light);
            border-radius: 8px;
            border-left: 4px solid var(--primary-color);
        `;
        
        const fileInfo = document.createElement('div');
        fileInfo.innerHTML = `
            <div style="font-weight: 500; color: var(--dark-color);">${file.name}</div>
            <div style="font-size: 0.9rem; color: var(--gray-medium);">${formatFileSize(file.size)}</div>
        `;
        
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--danger-color);
            cursor: pointer;
            font-size: 1.2rem;
            padding: 5px;
        `;
        removeBtn.onclick = function() {
            removeFile(index);
        };
        
        fileItem.appendChild(fileInfo);
        fileItem.appendChild(removeBtn);
        fileList.appendChild(fileItem);
    });
}

function removeFile(index) {
    const input = document.getElementById('projectFiles');
    const files = Array.from(input.files);
    files.splice(index, 1);
    
    // Create new FileList
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
    
    // Update file list display
    handleFileUpload(input);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility Functions
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        const fileList = document.getElementById('fileList');
        if (fileList) fileList.innerHTML = '';
        showStudentNotification('Form has been reset');
    }
}

function showStudentNotification(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    const toastContent = toast.querySelector('.toast-content');
    
    // Update toast content based on type
    if (type === 'success') {
        toastContent.innerHTML = `<i class="fas fa-check-circle"></i><p>${message}</p>`;
        toast.style.background = 'var(--success-color)';
    } else if (type === 'error') {
        toastContent.innerHTML = `<i class="fas fa-exclamation-circle"></i><p>${message}</p>`;
        toast.style.background = 'var(--danger-color)';
    } else if (type === 'info') {
        toastContent.innerHTML = `<i class="fas fa-info-circle"></i><p>${message}</p>`;
        toast.style.background = 'var(--info-color)';
    } else if (type === 'warning') {
        toastContent.innerHTML = `<i class="fas fa-exclamation-triangle"></i><p>${message}</p>`;
        toast.style.background = 'var(--warning-color)';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Action Functions
function viewGuideContact() {
    showStudentNotification('Opening guide contact information...', 'info');
    setTimeout(() => {
        alert('Guide Contact Information:\n\nDr. Smith\nComputer Science Department\nEmail: dr.smith@university.edu\nPhone: +1 (555) 123-4567\nOffice: CS Building, Room 305\nOffice Hours: Mon-Wed 2:00 PM - 4:00 PM');
    }, 500);
}

function downloadResources() {
    showStudentNotification('Downloading resources...', 'info');
    // Simulate download
    setTimeout(() => {
        showStudentNotification('Resources downloaded successfully!', 'success');
    }, 1500);
}

function downloadProjectBrief() {
    showStudentNotification('Downloading project brief...', 'info');
    // Simulate download
    setTimeout(() => {
        showStudentNotification('Project brief downloaded successfully!', 'success');
    }, 1500);
}

function viewFeedback(submissionId) {
    const feedbacks = {
        'S001': 'Excellent work! The implementation is robust and well-documented. The user interface is intuitive and responsive. Consider adding more test cases for edge scenarios.',
        'S002': 'Good submission overall. The core functionality works well. Some areas for improvement: add more comments to the code and improve error handling.',
        'S003': 'Well done! The project meets all requirements. The documentation is thorough. Keep up the good work!'
    };
    
    alert(`Feedback for Submission:\n\n${feedbacks[submissionId] || 'No feedback available yet.'}`);
}

// Mock Data Functions (Replace with actual API calls)
async function getCurrentProject() {
    return {
        id: 'P001',
        title: 'E-Commerce Platform',
        department: 'Computer Science',
        dueDate: 'December 15, 2023',
        description: 'Develop a full-featured e-commerce platform with user authentication, product catalog, shopping cart, payment integration, and admin dashboard. The platform should be responsive, secure, and scalable.',
        guideName: 'Dr. Smith',
        guideDepartment: 'Computer Science',
        guideEmail: 'dr.smith@university.edu',
        guideContact: '+1 (555) 123-4567',
        groupLeader: 'John Doe',
        groupMembers: ['John Doe', 'Jane Smith', 'Bob Johnson'],
        division: 'A',
        status: 'In Progress'
    };
}

async function getStudentSubmissions() {
    return [
        {
            id: 'S001',
            title: 'E-Commerce Platform - Midterm',
            date: 'November 15, 2023',
            status: 'Graded',
            grade: 'A',
            feedback: 'Excellent progress!'
        },
        {
            id: 'S002',
            title: 'E-Commerce Platform - Design Phase',
            date: 'October 30, 2023',
            status: 'Graded',
            grade: 'B+',
            feedback: 'Good design documentation'
        },
        {
            id: 'S003',
            title: 'E-Commerce Platform - Requirements',
            date: 'October 10, 2023',
            status: 'Graded',
            grade: 'A-',
            feedback: 'Well documented requirements'
        }
    ];
}