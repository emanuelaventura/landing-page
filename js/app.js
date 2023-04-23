/**
 * 
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
*/

/**
 * Define Global Variables
 * 
*/

const navbarList = document.getElementById("navbar__list");
/* Note: I use getElementsByTagName() instead of querySelectorAll() 
  because I want a live HTMLCollection instead of a static NodeList. */
let sections = document.getElementsByTagName("section"); 
const coll = document.getElementsByClassName("landing__button_collapsible");
const mainPart = document.getElementsByTagName("main"); 
const scrollBackToTopButton = document.getElementById("scroll-back-to-top");
const scrollContainer =  document.body;

/**
 * End Global Variables
 * Start Helper Functions
 * 
*/

/**
 * check if the passed element is visible in the viewport
 * @param {HTMLElement} el
 * @returns {boolean} if it returns true, the HTML element is visible in the viewport
*/
const isElementInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return rect.top < (window.innerHeight / 2) &&
         rect.bottom >= (window.innerHeight/2 );
}

/**
 * Show a section if it was collapsed
 * update also the status of the relative button
 * @param {HTMLElement} el : section where to scroll
*/
 const showCollapsedSection = (el) => {
	if (el.style.display !== "block") {
		el.style.display = "block";
	}
	if (!el.previousElementSibling.classList.contains('landing__button_active')) {
		el.previousElementSibling.classList.add("landing__button_active");
	}
};

/**
 * End Helper Functions
 * Begin Main Functions
 * 
*/

/**
 * Build the navigation menu from each section of the landing page
*/
const buildNav = () => {
	const fragment = document.createDocumentFragment();
	for (let i=0;i< sections.length; i++ ) {
		if (i===0) {
				// first section showed at the beginning
				sections[i].style.display = "block";
		}
		const data = sections[i].getAttribute("data-nav");
		const sectionId = sections[i].getAttribute("id");
		const listItem = document.createElement("li");

		/*const linkItem = document.createElement("a");
		linkItem.innerHTML=data;
		linkItem.classList.add("menu__link");
		linkItem.id = "link_"+(i+1);
		linkItem.setAttribute("href","#"+sectionId);
		listItem.appendChild(linkItem); 
		I can reduce this commented code with the following line:*/
		listItem.innerHTML=`<a id=\"link_${i+1}\" href=\"#${sectionId}\" class="menu__link">${data}</a>`;

		fragment.appendChild(listItem);
	};
	navbarList.appendChild(fragment); // reflow and repaint here -- once!
}

/**
 * Make a section active/non-active (adding/removing the class landing__content_active) when it is in the viewport
 * make also the corrispondent navigation menu link active/non active
 */
const setSectionActive = () => {
	// note I use this for and not "for of" because I need the index
  for (let i=0;i< sections.length; i++ ) {
    if (isElementInViewport(sections[i])) {
      if (!sections[i].classList.contains("landing__content_active")) {
        //console.log(sections[i].getElementsByTagName("h2")[0].innerHTML + " is active");
        sections[i].classList.add("landing__content_active");
				document.getElementById("link_"+(i+1)).classList.add("navbar__menu_active");
      }
    } else {
			if (sections[i].classList.contains("landing__content_active")) {
				sections[i].classList.remove("landing__content_active");
				//console.log(sections[i].getElementsByTagName("h2")[0].innerHTML + " is Now inactive");
				//make non active also the respective nav link
				document.getElementById("link_"+(i+1)).classList.remove("navbar__menu_active");
			}
		}
  }
}

/**
 * Scroll to the related section when clicking a menu link
 * If that section was collapsed, it is opened
 * @param {MouseEvent} event
 */
const scrollToSection = (event) => {
	if (event.target.tagName === 'A') {
		event.preventDefault();
		const sectionIdWhereToScroll = event.target.getAttribute("href").slice(1);
		const sectionWhereToScroll=document.getElementById(sectionIdWhereToScroll);
		showCollapsedSection(sectionWhereToScroll);
		sectionWhereToScroll.scrollIntoView({ block: 'end',  behavior: 'smooth' });
	}
}

/**
 * Collapse/open the following section
 * @param {MouseEvent} event
*/
const collapseSectionToggle = (event) => {
  if (event.target.tagName === 'BUTTON') {
    event.target.classList.toggle("landing__button_active");
    let content = event.target.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  }
};

/**
 * Scroll back to top smoothly
*/
const scrollBackToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Show/Hide scroll-back-to-top button
*/
const toggleScrollBackToTopButton = () => {
    if (scrollContainer.scrollTop > scrollContainer.clientHeight) {
        scrollBackToTopButton.style.display = 'block';
    } else {
        scrollBackToTopButton.style.display = 'none';
    }
};

/**
 * callback called the user scrolls
*/
const scrollCallback = () => {
    setSectionActive();
    toggleScrollBackToTopButton();
}

/**
 * End Main Functions
 * Begin Events
 * 
*/

// Build menu 
// I don't listen any event to build the nav because I load the script
// just before the end of the body so after all sections
buildNav();

// Scroll to section on link click (using event delegation)
navbarList.addEventListener('click', (event) => {scrollToSection(event)});

// Set sections as active + handle visibility of scrollBackToButton
document.addEventListener("scroll", scrollCallback);

// Collapsable sections (using event delegation)
mainPart[0].addEventListener("click", (event) => {collapseSectionToggle(event)});

// Scrool back to top Button
scrollBackToTopButton.addEventListener("click", () => {scrollBackToTop()});

// Recheck show/hide scroll back to top button when resizing window
window.addEventListener('resize', toggleScrollBackToTopButton);