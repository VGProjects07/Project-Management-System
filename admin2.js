// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set current date
    updateCurrentDate();
    
    // Load initial page
    loadPage('dashboard');
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize theme from localStorage
    initTheme();
    
    // Check if installed as PWA
    checkPWA();
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        updateThemeToggleButton();
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeToggleButton();
}

function updateThemeToggleButton() {
    const toggleBtn = document.getElementById('themeToggle');
    const isDark = document.body.classList.contains('dark-theme');
    
    toggleBtn.innerHTML = isDark 
        ? '<i class="fas fa-sun"></i> Light Mode'
        : '<i class="fas fa-moon"></i> Dark Mode';
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
function setupEventListeners() {
    // Sidebar menu clicks
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.parentElement.getAttribute('data-page');
            loadPage(page);
            
            // Update active state
            document.querySelectorAll('.sidebar-menu li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    });
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Logout button
    document.querySelector('.logout-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            showNotification('Logged out successfully!');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
        }
    });
    
    // Notification icon
    document.querySelector('.notification-icon').addEventListener('click', function() {
        showNotification('No new notifications', 'info');
    });
}

// Page Loading System
async function loadPage(page) {
    const contentArea = document.getElementById('pageContent');
    
    // Show loading state
    contentArea.innerHTML = '<div class="loading">Loading...</div>';
    
    try {
        let htmlContent = '';
        
        switch(page) {
            case 'dashboard':
                htmlContent = getDashboardContent();
                break;
            case 'add-project':
                htmlContent = await getAddProjectContent();
                break;
            case 'assign-project':
                htmlContent = await getAssignProjectContent();
                break;
            case 'create-group':
                htmlContent = await getCreateGroupContent();
                break;
            case 'view-guide':
                htmlContent = await getViewGuideContent();
                break;
            case 'view-assignments':
                htmlContent = await getViewAssignmentsContent();
                break;
            case 'submitted-projects':
                htmlContent = await getSubmittedProjectsContent();
                break;
            default:
                htmlContent = getDashboardContent();
        }
        
        contentArea.innerHTML = htmlContent;
        
        // Initialize page-specific scripts
        initPageScripts(page);
        
        // Update page title
        updatePageTitle(page);
        
    } catch (error) {
        console.error('Error loading page:', error);
        contentArea.innerHTML = '<div class="error">Error loading content. Please try again.</div>';
    }
}

function updatePageTitle(page) {
    const pageTitles = {
        'dashboard': 'Dashboard',
        'add-project': 'Add Project',
        'assign-project': 'Assign Project',
        'create-group': 'Create Group',
        'view-guide': 'View Guide',
        'view-assignments': 'View Assignments',
        'submitted-projects': 'Submitted Projects'
    };
    
    const title = pageTitles[page] || 'Admin Dashboard';
    document.querySelector('.main-header h1').textContent = title;
}

// Page Content Functions
function getDashboardContent() {
    return `
        <div class="dashboard-grid">
            <div class="stats-card">
                <div class="stats-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <i class="fas fa-project-diagram"></i>
                </div>
                <h3>Total Projects</h3>
                <p class="stats-number">24</p>
                <p class="stats-change">+5 this month</p>
            </div>
            
            <div class="stats-card">
                <div class="stats-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <i class="fas fa-users"></i>
                </div>
                <h3>Student Groups</h3>
                <p class="stats-number">15</p>
                <p class="stats-change">+2 this week</p>
            </div>
            
            <div class="stats-card">
                <div class="stats-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <h3>Active Guides</h3>
                <p class="stats-number">8</p>
                <p class="stats-change">All assigned</p>
            </div>
            
            <div class="stats-card">
                <div class="stats-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Submitted</h3>
                <p class="stats-number">12</p>
                <p class="stats-change">48% completed</p>
            </div>
        </div>
        
        <div class="recent-activity">
            <h2>Recent Activity</h2>
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-icon success">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="activity-content">
                        <p>Group "Alpha" submitted project "E-Commerce Platform"</p>
                        <span class="activity-time">2 hours ago</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon warning">
                        <i class="fas fa-exclamation"></i>
                    </div>
                    <div class="activity-content">
                        <p>Project "AI Chatbot" deadline is in 3 days</p>
                        <span class="activity-time">1 day ago</span>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon info">
                        <i class="fas fa-info"></i>
                    </div>
                    <div class="activity-content">
                        <p>New group "Gamma" created in Computer Science department</p>
                        <span class="activity-time">2 days ago</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function getAddProjectContent() {
    // Simulate API call for guides
    const guides = await getGuides();
    
    return `
        <div class="form-container">
            <h2>Add New Project</h2>
            <form id="addProjectForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="projectId">Project ID *</label>
                        <input type="text" id="projectId" class="form-control" required 
                               placeholder="Enter unique project ID">
                    </div>
                    <div class="form-group">
                        <label for="projectTitle">Project Title *</label>
                        <input type="text" id="projectTitle" class="form-control" required 
                               placeholder="Enter project title">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="projectDescription">Description *</label>
                    <textarea id="projectDescription" class="form-control" rows="4" required 
                              placeholder="Describe the project requirements and objectives"></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="department">Department *</label>
                        <select id="department" class="form-control" required>
                            <option value="">Select Department</option>
                            <option value="computer-science">Computer Science</option>
                            <option value="information-technology">Information Technology</option>
                            <option value="electronics">Electronics Engineering</option>
                            <option value="mechanical">Mechanical Engineering</option>
                            <option value="civil">Civil Engineering</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="guide">Guide *</label>
                        <select id="guide" class="form-control" required>
                            <option value="">Select Guide</option>
                            ${guides.map(guide => 
                                `<option value="${guide.id}">${guide.name} (${guide.department})</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="dueDate">Due Date *</label>
                        <input type="date" id="dueDate" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="createdBy">Created By</label>
                        <input type="text" id="createdBy" class="form-control" 
                               value="Admin User" readonly>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="resetForm('addProjectForm')">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Save Project
                    </button>
                </div>
            </form>
        </div>
    `;
}

async function getAssignProjectContent() {
    const projects = await getProjects();
    const groups = await getStudentGroups();
    
    return `
        <div class="form-container">
            <h2>Assign Project to Group</h2>
            <form id="assignProjectForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="selectProject">Select Project *</label>
                        <select id="selectProject" class="form-control" required>
                            <option value="">Choose a project</option>
                            ${projects.map(project => 
                                `<option value="${project.id}">${project.title} (${project.department})</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="selectGroup">Select Student Group *</label>
                        <select id="selectGroup" class="form-control" required>
                            <option value="">Choose a group</option>
                            ${groups.map(group => 
                                `<option value="${group.id}">
                                    ${group.leader} - ${group.department} (${group.division})
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Selected Group Details</label>
                    <div id="groupDetails" class="group-details">
                        <p>Select a group to view details</p>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="assignmentDate">Assignment Date</label>
                        <input type="date" id="assignmentDate" class="form-control" 
                               value="${new Date().toISOString().split('T')[0]}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="assignedBy">Assigned By</label>
                        <input type="text" id="assignedBy" class="form-control" 
                               value="Admin User" readonly>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="resetForm('assignProjectForm')">
                        <i class="fas fa-redo"></i> Clear
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-tasks"></i> Assign Project
                    </button>
                </div>
            </form>
        </div>
    `;
}

async function getCreateGroupContent() {
    return `
        <div class="form-container">
            <h2>Create Student Group</h2>
            <form id="createGroupForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="groupLeader">Group Leader Username *</label>
                        <input type="text" id="groupLeader" class="form-control" required 
                               placeholder="Enter leader's username">
                    </div>
                    <div class="form-group">
                        <label for="groupDepartment">Department *</label>
                        <select id="groupDepartment" class="form-control" required>
                            <option value="">Select Department</option>
                            <option value="computer-science">Computer Science</option>
                            <option value="information-technology">Information Technology</option>
                            <option value="electronics">Electronics Engineering</option>
                            <option value="mechanical">Mechanical Engineering</option>
                            <option value="civil">Civil Engineering</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="division">Division *</label>
                        <input type="text" id="division" class="form-control" required 
                               placeholder="e.g., A, B, C">
                    </div>
                    <div class="form-group">
                        <label for="groupSize">Group Size</label>
                        <input type="number" id="groupSize" class="form-control" 
                               value="3" min="1" max="5" readonly>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="member1">Member 2 *</label>
                    <input type="text" id="member1" class="form-control" required 
                           placeholder="Enter member username">
                </div>
                
                <div class="form-group">
                    <label for="member2">Member 3 *</label>
                    <input type="text" id="member2" class="form-control" required 
                           placeholder="Enter member username">
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="resetForm('createGroupForm')">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-users"></i> Create Group
                    </button>
                </div>
            </form>
        </div>
    `;
}

async function getViewGuideContent() {
    const assignments = await getGuideAssignments();
    
    return `
        <div class="table-container">
            <h2>Guide Assignment Details</h2>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Guide Name</th>
                            <th>Department</th>
                            <th>Group Leader</th>
                            <th>Group Division</th>
                            <th>Project Title</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${assignments.map(assignment => `
                            <tr>
                                <td>${assignment.guideName}</td>
                                <td>${assignment.department}</td>
                                <td>${assignment.groupLeader}</td>
                                <td>${assignment.division}</td>
                                <td>${assignment.projectTitle}</td>
                                <td>
                                    <span class="status-badge status-${assignment.status}">
                                        ${assignment.status}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="summary-stats" style="margin-top: 30px; display: flex; gap: 20px;">
                <div class="stat-box" style="background: #E3F2FD; padding: 15px; border-radius: 8px;">
                    <h3 style="margin: 0; color: #1976D2;">Total Guides</h3>
                    <p style="font-size: 1.5rem; font-weight: bold; margin: 5px 0;">8</p>
                </div>
                <div class="stat-box" style="background: #E8F5E9; padding: 15px; border-radius: 8px;">
                    <h3 style="margin: 0; color: #388E3C;">Assigned Groups</h3>
                    <p style="font-size: 1.5rem; font-weight: bold; margin: 5px 0;">15</p>
                </div>
                <div class="stat-box" style="background: #FFF3E0; padding: 15px; border-radius: 8px;">
                    <h3 style="margin: 0; color: #F57C00;">Available Guides</h3>
                    <p style="font-size: 1.5rem; font-weight: bold; margin: 5px 0;">3</p>
                </div>
            </div>
        </div>
    `;
}

async function getViewAssignmentsContent() {
    const assignments = await getAllAssignments();
    
    return `
        <div class="table-container">
            <h2>All Project Assignments</h2>
            <div class="table-controls" style="margin-bottom: 20px;">
                <div style="display: flex; gap: 15px;">
                    <input type="text" id="searchAssignments" class="form-control" 
                           placeholder="Search assignments..." style="flex: 1;">
                    <select id="filterStatus" class="form-control" style="width: 200px;">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="assigned">Assigned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="submitted">Submitted</option>
                    </select>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Project Title</th>
                            <th>Assigned Group</th>
                            <th>Guide</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${assignments.map(assignment => `
                            <tr>
                                <td>${assignment.projectTitle}</td>
                                <td>
                                    <strong>${assignment.groupLeader}</strong><br>
                                    <small>${assignment.department} - ${assignment.division}</small>
                                </td>
                                <td>${assignment.guide}</td>
                                <td>${assignment.dueDate}</td>
                                <td>
                                    <span class="status-badge status-${assignment.status}">
                                        ${assignment.status}
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-icon btn-view" title="View Details">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon btn-edit" title="Edit Assignment">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon btn-delete" title="Delete Assignment">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="table-footer" style="margin-top: 20px; display: flex; justify-content: space-between;">
                <div class="pagination">
                    <button class="btn btn-secondary">Previous</button>
                    <span style="margin: 0 15px;">Page 1 of 3</span>
                    <button class="btn btn-secondary">Next</button>
                </div>
                <div>
                    <button class="btn btn-primary" onclick="exportToCSV()">
                        <i class="fas fa-download"></i> Export CSV
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function getSubmittedProjectsContent() {
    const submissions = await getSubmissions();
    
    return `
        <div class="table-container">
            <h2>Submitted Projects</h2>
            
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Project Title</th>
                            <th>Submitted By</th>
                            <th>Submission Date</th>
                            <th>Grade</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${submissions.map(submission => `
                            <tr>
                                <td>${submission.projectTitle}</td>
                                <td>
                                    <strong>${submission.groupLeader}</strong><br>
                                    <small>${submission.department}</small>
                                </td>
                                <td>${submission.submissionDate}</td>
                                <td>
                                    ${submission.grade ? 
                                        `<span class="grade-badge">${submission.grade}</span>` : 
                                        '<span class="status-badge status-pending">Not Graded</span>'
                                    }
                                </td>
                                <td>
                                    <span class="status-badge status-${submission.status}">
                                        ${submission.status}
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-icon btn-view" title="View Submission">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn-icon btn-edit" title="Assign Grade" 
                                                onclick="assignGrade('${submission.id}')">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn-icon" title="Download File" 
                                                style="background: #6c757d; color: white;">
                                            <i class="fas fa-download"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="submission-stats" style="margin-top: 30px;">
                <h3>Submission Statistics</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
                    <div style="background: #E3F2FD; padding: 20px; border-radius: 8px;">
                        <h4 style="margin: 0 0 10px 0; color: #1976D2;">Total Submissions</h4>
                        <p style="font-size: 2rem; font-weight: bold; margin: 0;">12</p>
                    </div>
                    <div style="background: #E8F5E9; padding: 20px; border-radius: 8px;">
                        <h4 style="margin: 0 0 10px 0; color: #388E3C;">Graded</h4>
                        <p style="font-size: 2rem; font-weight: bold; margin: 0;">8</p>
                    </div>
                    <div style="background: #FFF3E0; padding: 20px; border-radius: 8px;">
                        <h4 style="margin: 0 0 10px 0; color: #F57C00;">Pending Review</h4>
                        <p style="font-size: 2rem; font-weight: bold; margin: 0;">4</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize page-specific scripts
function initPageScripts(page) {
    switch(page) {
        case 'add-project':
            initAddProjectForm();
            break;
        case 'assign-project':
            initAssignProjectForm();
            break;
        case 'create-group':
            initCreateGroupForm();
            break;
        case 'view-assignments':
            initViewAssignments();
            break;
        case 'submitted-projects':
            initSubmittedProjects();
            break;
    }
}

// Form Initialization Functions
function initAddProjectForm() {
    const form = document.getElementById('addProjectForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const projectData = {
                id: document.getElementById('projectId').value,
                title: document.getElementById('projectTitle').value,
                description: document.getElementById('projectDescription').value,
                department: document.getElementById('department').value,
                guide: document.getElementById('guide').value,
                dueDate: document.getElementById('dueDate').value,
                createdBy: document.getElementById('createdBy').value
            };
            
            // Simulate saving to database
            setTimeout(() => {
                showNotification('Project added successfully!');
                resetForm('addProjectForm');
            }, 1000);
        });
    }
    
    // Set minimum date for due date
    const dueDateInput = document.getElementById('dueDate');
    if (dueDateInput) {
        const today = new Date();
        const minDate = new Date(today);
        minDate.setDate(today.getDate() + 1);
        dueDateInput.min = minDate.toISOString().split('T')[0];
        dueDateInput.value = minDate.toISOString().split('T')[0];
    }
}

function initAssignProjectForm() {
    const form = document.getElementById('assignProjectForm');
    const groupSelect = document.getElementById('selectGroup');
    
    if (groupSelect) {
        groupSelect.addEventListener('change', function() {
            updateGroupDetails(this.value);
        });
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const assignmentData = {
                projectId: document.getElementById('selectProject').value,
                groupId: document.getElementById('selectGroup').value,
                assignmentDate: document.getElementById('assignmentDate').value,
                assignedBy: document.getElementById('assignedBy').value
            };
            
            // Simulate assignment
            setTimeout(() => {
                showNotification('Project assigned successfully!');
                resetForm('assignProjectForm');
                document.getElementById('groupDetails').innerHTML = 
                    '<p>Select a group to view details</p>';
            }, 1000);
        });
    }
}

async function updateGroupDetails(groupId) {
    const groupDetails = document.getElementById('groupDetails');
    if (!groupId) {
        groupDetails.innerHTML = '<p>Select a group to view details</p>';
        return;
    }
    
    // Simulate fetching group details
    const groups = await getStudentGroups();
    const group = groups.find(g => g.id === groupId);
    
    if (group) {
        groupDetails.innerHTML = `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0;">Group Details</h4>
                <p style="margin: 5px 0;"><strong>Leader:</strong> ${group.leader}</p>
                <p style="margin: 5px 0;"><strong>Department:</strong> ${group.department}</p>
                <p style="margin: 5px 0;"><strong>Division:</strong> ${group.division}</p>
                <p style="margin: 5px 0;"><strong>Members:</strong> ${group.members.join(', ')}</p>
            </div>
        `;
    }
}

function initCreateGroupForm() {
    const form = document.getElementById('createGroupForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const groupData = {
                leader: document.getElementById('groupLeader').value,
                department: document.getElementById('groupDepartment').value,
                division: document.getElementById('division').value,
                members: [
                    document.getElementById('groupLeader').value,
                    document.getElementById('member1').value,
                    document.getElementById('member2').value
                ]
            };
            
            // Simulate group creation
            setTimeout(() => {
                showNotification('Student group created successfully!');
                resetForm('createGroupForm');
            }, 1000);
        });
    }
}

function initViewAssignments() {
    // Setup search functionality
    const searchInput = document.getElementById('searchAssignments');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterAssignments();
        });
    }
    
    // Setup status filter
    const statusFilter = document.getElementById('filterStatus');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAssignments);
    }
}

function initSubmittedProjects() {
    // Add any specific initialization for submitted projects page
}

// Utility Functions
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        showNotification('Form has been reset');
    }
}

function showNotification(message, type = 'success') {
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

function filterAssignments() {
    // Implementation for filtering assignments
    const searchTerm = document.getElementById('searchAssignments')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filterStatus')?.value || '';
    
    // This would filter the table rows in a real implementation
    console.log('Filtering with:', { searchTerm, statusFilter });
}

function assignGrade(submissionId) {
    const grade = prompt('Enter grade for this submission (A-F or 0-100):');
    if (grade !== null) {
        // Simulate saving grade
        setTimeout(() => {
            showNotification(`Grade ${grade} assigned successfully!`);
        }, 500);
    }
}

function exportToCSV() {
    showNotification('Exporting data to CSV...', 'info');
    // In a real implementation, this would generate and download a CSV file
    setTimeout(() => {
        showNotification('CSV exported successfully!');
    }, 1500);
}

// Mock Data Functions (Replace with actual API calls)
async function getGuides() {
    return [
        { id: 'G001', name: 'Dr. Smith', department: 'Computer Science' },
        { id: 'G002', name: 'Prof. Johnson', department: 'Information Technology' },
        { id: 'G003', name: 'Dr. Williams', department: 'Electronics Engineering' },
        { id: 'G004', name: 'Prof. Brown', department: 'Mechanical Engineering' },
        { id: 'G005', name: 'Dr. Davis', department: 'Civil Engineering' },
        { id: 'G006', name: 'Prof. Miller', department: 'Computer Science' }
    ];
}

async function getProjects() {
    return [
        { id: 'P001', title: 'E-Commerce Platform', department: 'Computer Science' },
        { id: 'P002', title: 'AI Chatbot', department: 'Information Technology' },
        { id: 'P003', title: 'IoT Home Automation', department: 'Electronics Engineering' },
        { id: 'P004', title: 'Solar Powered Vehicle', department: 'Mechanical Engineering' },
        { id: 'P005', title: 'Bridge Design Analysis', department: 'Civil Engineering' },
        { id: 'P006', title: 'Mobile Banking App', department: 'Computer Science' }
    ];
}

async function getStudentGroups() {
    return [
        { 
            id: 'G001', 
            leader: 'John Doe', 
            department: 'Computer Science', 
            division: 'A',
            members: ['John Doe', 'Jane Smith', 'Bob Johnson']
        },
        { 
            id: 'G002', 
            leader: 'Alice Brown', 
            department: 'Information Technology', 
            division: 'B',
            members: ['Alice Brown', 'Charlie Davis', 'Eve Wilson']
        },
        { 
            id: 'G003', 
            leader: 'Mike Taylor', 
            department: 'Electronics Engineering', 
            division: 'A',
            members: ['Mike Taylor', 'Sarah Clark', 'Tom Harris']
        }
    ];
}

async function getGuideAssignments() {
    return [
        {
            guideName: 'Dr. Smith',
            department: 'Computer Science',
            groupLeader: 'John Doe',
            division: 'A',
            projectTitle: 'E-Commerce Platform',
            status: 'assigned'
        },
        {
            guideName: 'Prof. Johnson',
            department: 'Information Technology',
            groupLeader: 'Alice Brown',
            division: 'B',
            projectTitle: 'AI Chatbot',
            status: 'in-progress'
        },
        {
            guideName: 'Dr. Williams',
            department: 'Electronics Engineering',
            groupLeader: 'Mike Taylor',
            division: 'A',
            projectTitle: 'IoT Home Automation',
            status: 'submitted'
        }
    ];
}

async function getAllAssignments() {
    return [
        {
            projectTitle: 'E-Commerce Platform',
            groupLeader: 'John Doe',
            department: 'Computer Science',
            division: 'A',
            guide: 'Dr. Smith',
            dueDate: '2023-12-15',
            status: 'assigned'
        },
        {
            projectTitle: 'AI Chatbot',
            groupLeader: 'Alice Brown',
            department: 'Information Technology',
            division: 'B',
            guide: 'Prof. Johnson',
            dueDate: '2023-12-20',
            status: 'in-progress'
        },
        {
            projectTitle: 'IoT Home Automation',
            groupLeader: 'Mike Taylor',
            department: 'Electronics Engineering',
            division: 'A',
            guide: 'Dr. Williams',
            dueDate: '2023-12-10',
            status: 'submitted'
        }
    ];
}

async function getSubmissions() {
    return [
        {
            id: 'S001',
            projectTitle: 'IoT Home Automation',
            groupLeader: 'Mike Taylor',
            department: 'Electronics Engineering',
            submissionDate: '2023-12-05',
            grade: 'A',
            status: 'graded'
        },
        {
            id: 'S002',
            projectTitle: 'Mobile Banking App',
            groupLeader: 'Sarah Clark',
            department: 'Computer Science',
            submissionDate: '2023-12-08',
            grade: null,
            status: 'submitted'
        },
        {
            id: 'S003',
            projectTitle: 'Solar Tracker System',
            groupLeader: 'Bob Johnson',
            department: 'Electronics Engineering',
            submissionDate: '2023-12-03',
            grade: 'B+',
            status: 'graded'
        }
    ];
}

// PWA Check
function checkPWA() {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Running as PWA');
    } else if (window.navigator.standalone) {
        console.log('Running as iOS PWA');
    }
}

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('ServiceWorker registered:', registration);
        }).catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}