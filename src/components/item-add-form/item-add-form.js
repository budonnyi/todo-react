import React, {Component} from 'react'
import './item-add-form.css'


export default class ItemAddForm extends Component {
    // constructor(props) {
    //     super(props);
    //
    //     this.state = {
    //         label: '',
    //         messages: '',
    //         error: '',
    //     }
    // }
    state = {
        label: ''
    }

    onLabelChange = (e) => {
        this.setState({
            label: e.target.value
        })
    }

    // onSubmit = (e) => {
    //     e.preventDefault()
    //     this.props.onAddItem(this.state.label)
    //     this.setState({
    //         label: ''
    //     })
    // }

    addNewsCallback = (newNews) => {
        const {todoData} = this.state;
        this.setState({todoData: [...todoData, newNews]});
    }

    onSubmit = (event) => {
        event.preventDefault();

        const { label } = this.state;
        console.log('props = ', this.props)
        const { addNewsCallback } = this.props;

        if ([label].some(el => !el.length)) {
            return this.setState({error: 'Заполните полe!', messages: ''});
        }

        const requestUrl = 'http://backend/todo' + `?label=${label}`;

        fetch(requestUrl, {method: 'POST'})
            .then(res => {
                const { status } = res;

                if (status < 200 || status > 299) {
                    throw new Error(`Ошибка при добавлении новости. Код ${status}`);
                }

                return res.json();
            })
            .then(addedNews => {
                addNewsCallback(addedNews);
                this.setState({
                    label: '',
                    messages: 'Новость успешно добавлена!',
                    error: '',
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({error: error.message, messages: ''});
            });


    // onSubmit = (e) => {
        // e.preventDefault()
        this.props.onAddItem(this.state.label)
        this.setState({
            label: ''
        })
    }

    render() {
        return (
            <form className='item-add-form d-flex'
                    onSubmit={this.onSubmit} >

                <input type='text'
                       className='form-control'
                       onChange={this.onLabelChange}
                       placeholder='Что сделать?'
                       value={this.state.label}
                />

                <button
                    className='btn btn-outline-secondary'>
                    Добавить
                </button>

            </form>
        )
    }
}
