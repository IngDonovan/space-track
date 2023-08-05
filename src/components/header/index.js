import './header.scss';
import logoHeader from '../../assets/AntICO.svg';
import logoSearch from '../../assets/search.svg';



export const headerView =`
<header>
    <div class="logo">
        <figure>
        <img src="${logoHeader}" alt="" />
        </figure>
        <h1>X-TRACK</h1>
    </div>
    <figure class="menu">
        <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_53_604)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M17.75 1C22.3063 1 26 4.69365 26 9.25C26 13.8063 22.3063 17.5 17.75 17.5C15.7419 17.5 13.9013 16.7825 12.4707 15.59L6.78033 21.2803C6.48744 21.5732 6.01256 21.5732 5.71967 21.2803C5.42678 20.9874 5.42678 20.5126 5.71967 20.2197L11.41 14.5293C10.2175 13.0987 9.5 11.2581 9.5 9.25C9.5 4.69365 13.1937 1 17.75 1ZM24.5 9.25C24.5 5.52208 21.4779 2.5 17.75 2.5C14.0221 2.5 11 5.52208 11 9.25C11 12.9779 14.0221 16 17.75 16C21.4779 16 24.5 12.9779 24.5 9.25Z" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </g>
            <defs>
            <filter id="filter0_d_53_604" x="-1" y="0" width="32" height="32" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_53_604"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_53_604" result="shape"/>
            </filter>
            </defs>
        </svg>
    </figure>
</header>
`;