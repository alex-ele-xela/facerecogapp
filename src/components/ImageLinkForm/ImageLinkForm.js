import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <div>
            <p className='f3'>
                This App will detect faces in your pictures. <br/>
                Enter a url of an image. Press Detect, then wait for a few seconds. <br/>
                Give it a try !!
            </p>

            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input type="text" className='f4 pa2 w-70 center' onChange={onInputChange}/>
                    <button 
                        className='w-30 ba br2 br--right grow link ph3 pv2 dib white bg-light-purple'
                        onClick={onButtonSubmit}>Detect</button>
                </div>
            </div>
        </div>
    );
};

export default ImageLinkForm;