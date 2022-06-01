import Spinner from 'react-bootstrap/Spinner';


const AppSpinner = props => {
    return (
        <div className='spinner-overlay'>
            <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}

export default AppSpinner;
