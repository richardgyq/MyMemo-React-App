import { React, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { thunkCreateMemo, thunkUpdateMemo } from 'store/memos';
import { CREATE_MEMO, UPDATE_MEMO } from 'constants';
import AppSpinner from 'components/app-spinner';


const MemoDetails = props => {
    const { isProcessing } = useSelector(state => state.sliceMemos);
    const dispatch = useDispatch();

    const location = useLocation();
    const emptyData = { title: '', memo: '' };
    const data = location.state && location.state.currentMemo ?
        location.state.currentMemo :
        emptyData;
    const [memoData, setMemoData] = useState(data);
    const [submitted, setSubmitted] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setMemoData({
            ...memoData,
            [name]: value
        });
    };

    const handleSubmit = event => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity()) {
            save();
            setValidated(false);
        }
    };

    const save = () => {
        if (props.mode === UPDATE_MEMO) {
            dispatch(thunkUpdateMemo(memoData));
        } else if (props.mode === CREATE_MEMO) {
            dispatch(thunkCreateMemo(memoData));
            setMemoData(emptyData);
        }
        setSubmitted(true);
    }
    
    return (
        <Container>
            { isProcessing && (
                <AppSpinner />
            )}
            { !isProcessing && submitted &&
                <Alert variant='info'>
                    <h4>Memo {props.mode === CREATE_MEMO ? 'created' : 'updated'} successfully.</h4>
                    <Link to='/'>Back to list</Link>
                </Alert>
            }
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>{props.mode === CREATE_MEMO ? "Create" : "Edit"} Memo</Form.Label>
                    <Form.Control type='text' required
                        placeholder='Enter memo title'
                        value={memoData.title} name='title'
                        onChange={handleChange}>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        Please enter a title.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Details</Form.Label>
                    <Form.Control as='textarea' rows={3}
                        placeholder='Enter memo text'
                        value={memoData.memo} name='memo'
                        onChange={handleChange}>
                    </Form.Control>
                </Form.Group>
                <Button type="submit" variant='info'>
                    {props.mode === CREATE_MEMO ? "Create" : "Update"} Memo
                </Button>
            </Form>
        </Container>
    );
}

export default MemoDetails;
