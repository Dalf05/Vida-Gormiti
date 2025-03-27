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
        // Check both the raw password and the hashed version for backward compatibility
        if (password === "lolcol" || md5(password + config.salt) === config.passwordHash) {
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

    // MD5 hashing function implementation
    function md5(string) {
        function cmn(q, a, b, x, s, t) {
            a = add32(add32(a, q), add32(x, t));
            return add32((a << s) | (a >>> (32 - s)), b);
        }

        function ff(a, b, c, d, x, s, t) {
            return cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }

        function gg(a, b, c, d, x, s, t) {
            return cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }

        function hh(a, b, c, d, x, s, t) {
            return cmn(b ^ c ^ d, a, b, x, s, t);
        }

        function ii(a, b, c, d, x, s, t) {
            return cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        function md5cycle(x, k) {
            let a = x[0], b = x[1], c = x[2], d = x[3];

            a = ff(a, b, c, d, k[0], 7, -680876936);
            d = ff(d, a, b, c, k[1], 12, -389564586);
            c = ff(c, d, a, b, k[2], 17, 606105819);
            b = ff(b, c, d, a, k[3], 22, -1044525330);
            a = ff(a, b, c, d, k[4], 7, -176418897);
            d = ff(d, a, b, c, k[5], 12, 1200080426);
            c = ff(c, d, a, b, k[6], 17, -1473231341);
            b = ff(b, c, d, a, k[7], 22, -45705983);
            a = ff(a, b, c, d, k[8], 7, 1770035416);
            d = ff(d, a, b, c, k[9], 12, -1958414417);
            c = ff(c, d, a, b, k[10], 17, -42063);
            b = ff(b, c, d, a, k[11], 22, -1990404162);
            a = ff(a, b, c, d, k[12], 7, 1804603682);
            d = ff(d, a, b, c, k[13], 12, -40341101);
            c = ff(c, d, a, b, k[14], 17, -1502002290);
            b = ff(b, c, d, a, k[15], 22, 1236535329);

            a = gg(a, b, c, d, k[1], 5, -165796510);
            d = gg(d, a, b, c, k[6], 9, -1069501632);
            c = gg(c, d, a, b, k[11], 14, 643717713);
            b = gg(b, c, d, a, k[0], 20, -373897302);
            a = gg(a, b, c, d, k[5], 5, -701558691);
            d = gg(d, a, b, c, k[10], 9, 38016083);
            c = gg(c, d, a, b, k[15], 14, -660478335);
            b = gg(b, c, d, a, k[4], 20, -405537848);
            a = gg(a, b, c, d, k[9], 5, 568446438);
            d = gg(d, a, b, c, k[14], 9, -1019803690);
            c = gg(c, d, a, b, k[3], 14, -187363961);
            b = gg(b, c, d, a, k[8], 20, 1163531501);
            a = gg(a, b, c, d, k[13], 5, -1444681467);
            d = gg(d, a, b, c, k[2], 9, -51403784);
            c = gg(c, d, a, b, k[7], 14, 1735328473);
            b = gg(b, c, d, a, k[12], 20, -1926607734);

            a = hh(a, b, c, d, k[5], 4, -378558);
            d = hh(d, a, b, c, k[8], 11, -2022574463);
            c = hh(c, d, a, b, k[11], 16, 1839030562);
            b = hh(b, c, d, a, k[14], 23, -35309556);
            a = hh(a, b, c, d, k[1], 4, -1530992060);
            d = hh(d, a, b, c, k[4], 11, 1272893353);
            c = hh(c, d, a, b, k[7], 16, -155497632);
            b = hh(b, c, d, a, k[10], 23, -1094730640);
            a = hh(a, b, c, d, k[13], 4, 681279174);
            d = hh(d, a, b, c, k[0], 11, -358537222);
            c = hh(c, d, a, b, k[3], 16, -722521979);
            b = hh(b, c, d, a, k[6], 23, 76029189);
            a = hh(a, b, c, d, k[9], 4, -640364487);
            d = hh(d, a, b, c, k[12], 11, -421815835);
            c = hh(c, d, a, b, k[15], 16, 530742520);
            b = hh(b, c, d, a, k[2], 23, -995338651);

            a = ii(a, b, c, d, k[0], 6, -198630844);
            d = ii(d, a, b, c, k[7], 10, 1126891415);
            c = ii(c, d, a, b, k[14], 15, -1416354905);
            b = ii(b, c, d, a, k[5], 21, -57434055);
            a = ii(a, b, c, d, k[12], 6, 1700485571);
            d = ii(d, a, b, c, k[3], 10, -1894986606);
            c = ii(c, d, a, b, k[10], 15, -1051523);
            b = ii(b, c, d, a, k[1], 21, -2054922799);
            a = ii(a, b, c, d, k[8], 6, 1873313359);
            d = ii(d, a, b, c, k[15], 10, -30611744);
            c = ii(c, d, a, b, k[6], 15, -1560198380);
            b = ii(b, c, d, a, k[13], 21, 1309151649);
            a = ii(a, b, c, d, k[4], 6, -145523070);
            d = ii(d, a, b, c, k[11], 10, -1120210379);
            c = ii(c, d, a, b, k[2], 15, 718787259);
            b = ii(b, c, d, a, k[9], 21, -343485551);

            x[0] = add32(a, x[0]);
            x[1] = add32(b, x[1]);
            x[2] = add32(c, x[2]);
            x[3] = add32(d, x[3]);
        }

        function md5blk(s) {
            let i, md5blks = [];
            for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
            }
            return md5blks;
        }

        function md51(s) {
            let n = s.length,
                state = [1732584193, -271733879, -1732584194, 271733878], i;
            for (i = 64; i <= s.length; i += 64) {
                md5cycle(state, md5blk(s.substring(i - 64, i)));
            }
            s = s.substring(i - 64);
            let tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (i = 0; i < s.length; i++)
                tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
            tail[i >> 2] |= 0x80 << ((i % 4) << 3);
            if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i++) tail[i] = 0;
            }
            tail[14] = n * 8;
            md5cycle(state, tail);
            return state;
        }

        function add32(a, b) {
            return (a + b) & 0xFFFFFFFF;
        }

        function hex_chr(val) {
            const hexDigits = '0123456789abcdef';
            return hexDigits.charAt(val & 0xF) + hexDigits.charAt(val >> 4 & 0xF);
        }

        function rhex(n) {
            let s = '', j = 0;
            for (; j < 4; j++)
                s += hex_chr((n >> (j * 8 + 4)) & 0x0F) + hex_chr((n >> (j * 8)) & 0x0F);
            return s;
        }

        function hex(x) {
            for (let i = 0; i < x.length; i++)
                x[i] = rhex(x[i]);
            return x.join('');
        }

        return hex(md51(string));
    }
});