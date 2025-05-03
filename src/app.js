import { calculateTextStats } from './utils/textAnalyzer.js';
import { formatNumber } from './utils/formatters.js';
import { saveTextToLocalStorage, getTextFromLocalStorage } from './utils/storage.js';
import { icons } from './components/icons.js';

export function renderApp() {
  const app = document.getElementById('app');
  
  // Create app container
  app.innerHTML = `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow">
        <div class="container mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 class="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
                ${icons.text}
                <span class="ml-2">Character Calculator</span>
              </h1>
              <p class="mt-2 text-gray-600 dark:text-gray-300">Count characters, words, and more in your text</p>
            </div>
            <div class="mt-4 md:mt-0">
              <button id="theme-toggle" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                ${icons.moon}
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="flex-grow container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Text input section -->
          <div class="lg:col-span-2">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Enter your text</h2>
                <div>
                  <button id="clear-button" class="text-gray-500 hover:text-red-500 dark:text-gray-400 p-2 rounded transition-colors" title="Clear text">
                    ${icons.trash}
                  </button>
                </div>
              </div>
              <textarea 
                id="text-input"
                class="w-full h-80 p-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 resize-none transition-colors"
                placeholder="Type or paste your text here..."
              ></textarea>
            </div>
          </div>

          <!-- Statistics section -->
          <div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-semibold">Text Statistics</h2>
                <button id="copy-stats" class="text-gray-500 hover:text-blue-500 dark:text-gray-400 p-2 rounded transition-colors" title="Copy statistics">
                  ${icons.copy}
                </button>
              </div>
              
              <div class="space-y-6">
                <!-- Characters -->
                <div class="stat-card">
                  <div class="flex items-center mb-2">
                    <span class="text-blue-500 dark:text-blue-400 mr-2">${icons.characters}</span>
                    <h3 class="font-medium">Characters</h3>
                  </div>
                  <p id="character-count" class="text-3xl font-bold text-blue-600 dark:text-blue-400">0</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">including spaces</p>
                </div>

                <!-- Words -->
                <div class="stat-card">
                  <div class="flex items-center mb-2">
                    <span class="text-violet-500 dark:text-violet-400 mr-2">${icons.words}</span>
                    <h3 class="font-medium">Words</h3>
                  </div>
                  <p id="word-count" class="text-3xl font-bold text-violet-600 dark:text-violet-400">0</p>
                </div>

                <!-- Characters without spaces -->
                <div class="stat-card">
                  <div class="flex items-center mb-2">
                    <span class="text-indigo-500 dark:text-indigo-400 mr-2">${icons.noSpaces}</span>
                    <h3 class="font-medium">Characters (no spaces)</h3>
                  </div>
                  <p id="character-no-spaces-count" class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">0</p>
                </div>

                <!-- Paragraphs -->
                <div class="stat-card">
                  <div class="flex items-center mb-2">
                    <span class="text-teal-500 dark:text-teal-400 mr-2">${icons.paragraphs}</span>
                    <h3 class="font-medium">Paragraphs</h3>
                  </div>
                  <p id="paragraph-count" class="text-3xl font-bold text-teal-600 dark:text-teal-400">0</p>
                </div>

                <!-- Reading time -->
                <div class="stat-card">
                  <div class="flex items-center mb-2">
                    <span class="text-amber-500 dark:text-amber-400 mr-2">${icons.clock}</span>
                    <h3 class="font-medium">Reading Time</h3>
                  </div>
                  <p id="reading-time" class="text-3xl font-bold text-amber-600 dark:text-amber-400">0 sec</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">based on 200 wpm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div class="container mx-auto px-4 py-6">
          <p class="text-center text-gray-500 dark:text-gray-400">
            Character Calculator | A simple tool to analyze your text
          </p>
        </div>
      </footer>
    </div>
  `;

  // Get DOM elements
  const textInput = document.getElementById('text-input');
  const characterCount = document.getElementById('character-count');
  const wordCount = document.getElementById('word-count');
  const characterNoSpacesCount = document.getElementById('character-no-spaces-count');
  const paragraphCount = document.getElementById('paragraph-count');
  const readingTime = document.getElementById('reading-time');
  const clearButton = document.getElementById('clear-button');
  const copyStatsButton = document.getElementById('copy-stats');
  const themeToggle = document.getElementById('theme-toggle');

  // Load saved text if available
  const savedText = getTextFromLocalStorage();
  if (savedText) {
    textInput.value = savedText;
    updateStats(savedText);
  }

  // Update statistics on input
  textInput.addEventListener('input', (e) => {
    const text = e.target.value;
    updateStats(text);
    saveTextToLocalStorage(text);
  });

  // Clear text
  clearButton.addEventListener('click', () => {
    textInput.value = '';
    updateStats('');
    saveTextToLocalStorage('');
    textInput.focus();
  });

  // Copy statistics
  copyStatsButton.addEventListener('click', () => {
    const stats = `
Character Count: ${characterCount.textContent}
Word Count: ${wordCount.textContent}
Characters (no spaces): ${characterNoSpacesCount.textContent}
Paragraph Count: ${paragraphCount.textContent}
Reading Time: ${readingTime.textContent}
    `.trim();
    
    navigator.clipboard.writeText(stats).then(() => {
      showToast('Statistics copied!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  });

  // Toggle theme
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerHTML = isDark ? icons.sun : icons.moon;
  });

  // Initialize theme
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    themeToggle.innerHTML = icons.sun;
  } else {
    themeToggle.innerHTML = icons.moon;
  }

  // Update statistics function
  function updateStats(text) {
    const stats = calculateTextStats(text);
    
    animateCounter(characterCount, stats.characters);
    animateCounter(wordCount, stats.words);
    animateCounter(characterNoSpacesCount, stats.charactersNoSpaces);
    animateCounter(paragraphCount, stats.paragraphs);
    
    // Reading time
    const readingTimeValue = stats.readingTime;
    let readingTimeText;
    
    if (readingTimeValue < 60) {
      readingTimeText = `${readingTimeValue} sec`;
    } else {
      const minutes = Math.floor(readingTimeValue / 60);
      const seconds = readingTimeValue % 60;
      readingTimeText = seconds === 0 ? 
        `${minutes} min` : 
        `${minutes} min ${seconds} sec`;
    }
    
    readingTime.textContent = readingTimeText;
  }

  // Animate counter function
  function animateCounter(element, target) {
    const current = parseInt(element.textContent.replace(/,/g, ''), 10) || 0;
    
    if (target === current) return;
    
    const duration = 500; // ms
    const start = performance.now();
    
    const animate = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic: progress = 1 - Math.pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(current + (target - current) * easeProgress);
      
      element.textContent = formatNumber(value);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Toast notification
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('translate-y-24');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  }
}