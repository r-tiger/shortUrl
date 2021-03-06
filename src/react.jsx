import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { Navbar, FormControl, FormGroup, Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';  // in ECMAScript 6


const reUrl = /^(ftp|http|https):\/\/[^ "]+$/;

// It's a data format example.
function urlFormatter(cell, row) {
    return '<a href=' + cell + '>' + cell + '</a> ';
}

function shortFormatter(cell, row) {
    return '<a href=' + window.location.href + cell + '>' + window.location.href + cell + '</a> ';
}

class ReactTable extends React.Component {
    constructor() {
        super();
        this.state = {
            urls: []
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        $.ajax({
            url     : '/api/get',
            type    : 'GET',
            dataType: 'JSON',
            success : function(data) {
                this.setState({urls: data});
            }.bind(this)
        });
    }

    render() {
        if (this.state.urls.length == 0) {
            return null;
        }
        return (
            <BootstrapTable data={this.state.urls}>
                <TableHeaderColumn dataField="url" dataFormat={urlFormatter} isKey={true}
                                   dataAlign="center">Urls</TableHeaderColumn>
                <TableHeaderColumn dataField="shortUrl" dataFormat={shortFormatter} dataSort={true}>Short
                    Url</TableHeaderColumn>
                <TableHeaderColumn dataField="date" dataSort={true}>Date</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

class NavbarForm extends React.Component {
    constructor() {
        super();
        this.state = {
            url: ''
        };
        this.urlChange = this.urlChange.bind(this);
    }

    save() {
        const url = this.refs.urlInput.value;
        if (reUrl.test(this.state.url)) {
            const self = this;
            $.ajax({
                url     : '/api/save',
                type    : 'POST',
                dataType: 'JSON',
                data    : {url: url},
                success : function(data) {
                    // display the shortened URL to the user that is returned by the server
                    console.log(data);
                    self.refs['table'].loadData();
                }
            });
        }
    }

    validationUrl() {
        const length = this.state.url.length;
        if (reUrl.test(this.state.url)) return 'success';
        else if (length > 4) return 'warning';
        else if (length > 0) return 'error';
    }

    urlChange(e) {
        this.setState({
            url: e.target.value
        });
    }

    render() {
        return (
            <div className="container">
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">Past your url to shorten</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Navbar.Form pullLeft>
                            <FormGroup validationState={this.validationUrl()}>
                                <FormControl type="text" ref="urlInput" onChange={this.urlChange}
                                   placeholder="enter Url..."/>{'  '}
                            </FormGroup>
                            {' '}
                            <Button onClick={this.save.bind(this)} bsStyle="primary" type="submit">Create Link</Button>
                        </Navbar.Form>
                    </Navbar.Collapse>
                </Navbar>
                <ReactTable ref="table"/>
            </div>
        );
    }
}

ReactDOM.render(
    <NavbarForm/>,
    document.getElementById('mainApp')
);