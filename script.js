import config from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const passwordScreen = document.getElementById('password-screen');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');
    const content = document.getElementById('content');

    // Set content to hidden immediately when DOM loads to prevent flashing
    content.style.display = 'none';
    content.style.visibility = 'hidden'; // Ensure content is not visible even with CSS issues
    passwordScreen.style.display = 'flex';
    
    // Create an overlay to prevent seeing content
    const securityOverlay = document.createElement('div');
    securityOverlay.style.position = 'fixed';
    securityOverlay.style.top = '0';
    securityOverlay.style.left = '0';
    securityOverlay.style.width = '100%';
    securityOverlay.style.height = '100%';
    securityOverlay.style.backgroundColor = '#0f0c29';
    securityOverlay.style.zIndex = '1000';
    document.body.appendChild(securityOverlay);

    // Content sections
    const homeSection = document.getElementById('home');
    const trendingSection = document.getElementById('trending');
    const searchSection = document.getElementById('search');
    const uploadSection = document.getElementById('upload');

    // Buttons
    let uploadButton = null;
    try {
      uploadButton = document.querySelector('.upload-button');
    } catch (error) {
      console.error("Upload button not found:", error);
    }
    
    passwordSubmit.addEventListener('click', () => {
        const password = passwordInput.value;
        if (password === config.password) {
            passwordScreen.style.display = 'none';
            securityOverlay.style.display = 'none'; // Remove security overlay
            content.style.display = 'flex'; // Changed to flex to accommodate sidebar
            content.style.visibility = 'visible'; // Make content visible
            showHomePage(); // Show home page after successful login
        } else {
            passwordError.textContent = 'Incorrect Password';
        }
    });

    passwordInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            passwordSubmit.click();
        }
    });

    // Function to show the home page and hide others
    function showHomePage() {
        homeSection.style.display = 'block';
        trendingSection.style.display = 'none';
        searchSection.style.display = 'none';
        uploadSection.style.display = 'none';
        
        // Fix mobile display issues by scrolling to top
        window.scrollTo(0, 0);
    }

    // Function to show the trending page and hide others
    function showTrendingPage() {
        homeSection.style.display = 'none';
        trendingSection.style.display = 'block';
        searchSection.style.display = 'none';
        uploadSection.style.display = 'none';
        
        // Fix mobile display issues by scrolling to top
        window.scrollTo(0, 0);
    }

    // Function to show the search page and hide others
    function showSearchPage() {
        homeSection.style.display = 'none';
        trendingSection.style.display = 'none';
        searchSection.style.display = 'block';
        uploadSection.style.display = 'none';

        // Initialize search filters and make them visible by default
        initializeSearchFilters();
        
        // Show filters by default
        document.querySelector('.filters-container').style.display = 'flex';
        
        // Fix mobile display issues by scrolling to top
        window.scrollTo(0, 0);
    }

    function initializeSearchFilters() {
        const categoryList = document.getElementById('category-list');
        const personList = document.getElementById('person-list');
        const selectedFiltersContainer = document.getElementById('selected-filters');
        const filterToggle = document.querySelector('.filter-toggle');
        const filtersContainer = document.querySelector('.filters-container');

        let selectedCategories = [];
        let selectedPeople = [];

        filtersContainer.style.display = 'none';

        filterToggle.addEventListener('click', () => {
            filtersContainer.style.display = filtersContainer.style.display === 'none' ? 'flex' : 'none';
        });

        const updateSelectedFilters = () => {
            selectedFiltersContainer.innerHTML = '';

            const addFilter = (filterType, filterValue) => {
                const filterItem = document.createElement('div');
                filterItem.classList.add('filter-item');
                filterItem.textContent = `${filterValue}`;

                filterItem.addEventListener('click', () => {
                    if (filterType === 'category') {
                        selectedCategories = selectedCategories.filter(item => item !== filterValue);
                        categoryList.querySelectorAll('.filter-chip').forEach(chip => {
                            if (chip.dataset.value === filterValue) {
                                chip.classList.remove('selected');
                            }
                        });
                    } else if (filterType === 'person') {
                        selectedPeople = selectedPeople.filter(item => item !== filterValue);
                        personList.querySelectorAll('.filter-chip').forEach(chip => {
                            if (chip.dataset.value === filterValue) {
                                chip.classList.remove('selected');
                            }
                        });
                    }
                    updateSelectedFilters();
                });
                selectedFiltersContainer.appendChild(filterItem);
            };

            selectedCategories.forEach(category => addFilter('category', category));
            selectedPeople.forEach(person => addFilter('person', person));
        };

        categoryList.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-chip')) {
                const value = event.target.dataset.value;
                if (selectedCategories.includes(value)) {
                    selectedCategories = selectedCategories.filter(item => item !== value);
                    event.target.classList.remove('selected');
                } else {
                    selectedCategories.push(value);
                    event.target.classList.add('selected');
                }
                updateSelectedFilters();
            }
        });

        personList.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-chip')) {
                const value = event.target.dataset.value;
                if (selectedPeople.includes(value)) {
                    selectedPeople = selectedPeople.filter(item => item !== value);
                    event.target.classList.remove('selected');
                } else {
                    selectedPeople.push(value);
                    event.target.classList.add('selected');
                }
                updateSelectedFilters();
            }
        });
    }

    // Function to show the upload page and hide others
    function showUploadPage() {
        homeSection.style.display = 'none';
        trendingSection.style.display = 'none';
        searchSection.style.display = 'none';
        uploadSection.style.display = 'block';

        // Initialize upload filters
        initializeUploadFilters();
        
        // Fix mobile display issues by scrolling to top
        window.scrollTo(0, 0);
    }

    function initializeUploadFilters() {
        const categoryList = document.getElementById('category-list-upload');
        const personList = document.getElementById('person-list-upload');
        const selectedFiltersContainer = document.getElementById('selected-filters-upload');

        let selectedCategories = [];
        let selectedPeople = [];

        const updateSelectedFilters = () => {
            selectedFiltersContainer.innerHTML = '';

            const addFilter = (filterType, filterValue) => {
                const filterItem = document.createElement('div');
                filterItem.classList.add('filter-item');
                filterItem.textContent = `${filterValue}`;

                filterItem.addEventListener('click', () => {
                    if (filterType === 'category') {
                        selectedCategories = selectedCategories.filter(item => item !== filterValue);
                        categoryList.querySelectorAll('li').forEach(li => {
                            if (li.dataset.value === filterValue) {
                                li.classList.remove('selected');
                            }
                        });
                    } else if (filterType === 'person') {
                        selectedPeople = selectedPeople.filter(item => item !== filterValue);
                        personList.querySelectorAll('li').forEach(li => {
                            if (li.dataset.value === filterValue) {
                                li.classList.remove('selected');
                            }
                        });
                    }
                    updateSelectedFilters();
                });
                selectedFiltersContainer.appendChild(filterItem);
            };

            selectedCategories.forEach(category => addFilter('category', category));
            selectedPeople.forEach(person => addFilter('person', person));
        };

        categoryList.addEventListener('click', (event) => {
            if (event.target.tagName === 'LI') {
                const value = event.target.dataset.value;
                if (selectedCategories.includes(value)) {
                    selectedCategories = selectedCategories.filter(item => item !== value);
                    event.target.classList.remove('selected');
                } else {
                    selectedCategories.push(value);
                    event.target.classList.add('selected');
                }
                updateSelectedFilters();
            }
        });

        personList.addEventListener('click', (event) => {
            if (event.target.tagName === 'LI') {
                const value = event.target.dataset.value;
                if (selectedPeople.includes(value)) {
                    selectedPeople = selectedPeople.filter(item => item !== value);
                    event.target.classList.remove('selected');
                } else {
                    selectedPeople.push(value);
                    event.target.classList.add('selected');
                }
                updateSelectedFilters();
            }
        });
    }

    // New upload video functionality
    const uploadForm = document.getElementById('upload-form');
    const videoUpload = document.getElementById('video-upload');
    const videoPreview = document.getElementById('video-preview');
    const progressBar = document.querySelector('.progress-bar');
    const uploadMessage = document.getElementById('upload-message');

    uploadForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const file = videoUpload.files[0];
        if (!file) {
            uploadMessage.textContent = 'Por favor, selecciona un video.';
            uploadMessage.style.color = 'red';
            return;
        }

        const formData = new FormData(uploadForm);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload', true); // Replace '/upload' with your server endpoint

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progressBar.style.width = percentComplete + '%';
                progressBar.textContent = percentComplete.toFixed(0) + '%';
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                uploadMessage.textContent = 'Video subido correctamente.';
                uploadMessage.style.color = 'green';
                videoPreview.src = URL.createObjectURL(file);
                videoPreview.style.display = 'block';
            } else {
                uploadMessage.textContent = 'Error al subir el video.';
                uploadMessage.style.color = 'red';
            }
            progressBar.style.width = '0%';
            progressBar.textContent = '';
        };

        xhr.onerror = () => {
            uploadMessage.textContent = 'Error de red al subir el video.';
            uploadMessage.style.color = 'red';
            progressBar.style.width = '0%';
            progressBar.textContent = '';
        };

        xhr.send(formData);
    });

    let confetti;

    function startConfetti() {
        confetti = new JSConfetti();
        confetti.addConfetti({
            confettiNumber: 80,
            confettiRadius: 1,
        });
    }

    function stopConfetti() {
        if (confetti) {
            confetti.clear();
        }
    }

    function toggleModoFiesta() {
        document.body.classList.toggle('modo-fiesta');

        if (document.body.classList.contains('modo-fiesta')) {
            startConfetti();
        } else {
            stopConfetti();
        }
    }

    // Sidebar navigation event listeners
    document.querySelector('.sidebar nav ul li a[href="#home"]').addEventListener('click', (event) => {
        event.preventDefault();
        showHomePage();
    });

    document.querySelector('.sidebar nav ul li a[href="#trending"]').addEventListener('click', (event) => {
        event.preventDefault();
        showTrendingPage();
    });

    document.querySelector('.sidebar nav ul li a[href="#search"]').addEventListener('click', (event) => {
        event.preventDefault();
        showSearchPage();
    });

    document.querySelector('.sidebar nav ul li a[href="#upload"]').addEventListener('click', (event) => {
        event.preventDefault();
        showUploadPage();
    });

    // Handle window resize to fix mobile display issues
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 1024) {
            // Ensure proper display on mobile
            document.body.classList.add('mobile-view');
            
            // Force redraw of content to fix any layout issues
            const content = document.getElementById('content');
            if (content) {
                content.style.display = 'none';
                setTimeout(() => {
                    content.style.display = 'flex';
                }, 50);
            }
        } else {
            document.body.classList.remove('mobile-view');
        }
    });

    // Initialize mobile view if needed
    if (window.innerWidth <= 1024) {
        document.body.classList.add('mobile-view');
    }

    // Fix mobile horizontal scrolling issues
    document.querySelectorAll('.video-carousel').forEach(carousel => {
        carousel.addEventListener('scroll', function(e) {
            // Prevent parent element scrolling when carousel is scrolled
            e.stopPropagation();
        });
    });
});