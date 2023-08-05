import './header.scss';
import logoHeader from '../../assets/AntICO.svg';


export const headerView =`
<header>
    <div class="logo">
        <figure>
        <img src="${logoHeader}" alt="" />
        </figure>
        <h1>X-TRACK</h1>
    </div>
    <figure class="menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.75 1C19.3063 1 23 4.69365 23 9.25C23 13.8063 19.3063 17.5 14.75 17.5C12.7419 17.5 10.9013 16.7825 9.47071 15.59L3.78033 21.2803C3.48744 21.5732 3.01256 21.5732 2.71967 21.2803C2.42678 20.9874 2.42678 20.5126 2.71967 20.2197L8.41005 14.5293C7.21747 13.0987 6.5 11.2581 6.5 9.25C6.5 4.69365 10.1937 1 14.75 1ZM21.5 9.25C21.5 5.52208 18.4779 2.5 14.75 2.5C11.0221 2.5 8 5.52208 8 9.25C8 12.9779 11.0221 16 14.75 16C18.4779 16 21.5 12.9779 21.5 9.25Z" fill="currentColor"/>
        </svg>
    </figure>
</header>
`;