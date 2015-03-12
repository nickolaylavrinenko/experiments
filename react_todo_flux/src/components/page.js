
// styles
import './page.less';

// dependensies
import React from "react";
import Router, {Link, RouteHandler} from "react-router";
import List from "./list";
import Form from "./form";


var NotFoundPage = React.createClass({

    render : function() {
        return (
            <div className="app-wrapper">
                <div className="top-container">
                    <header className="app-header">
                        <div className="logo">TODO_APP</div>
                    </header>
                    <p className="not-found-message"> 
                        Sorry, the page is not found.
                    </p>
                    <div className="push"></div>
                </div>
                <div className="bottom-container">
                    <footer className="app-footer">
                        <span className="signature">kolyan-molyan.com</span>
                        <span className="year">{""+(new Date()).getFullYear()}</span>
                    </footer>
                </div>
            </div>
        );
    },

});


var Page = React.createClass({

    render : function() {
        return (
            <div className="app-wrapper">
                <div className="top-container">
                    <header className="app-header">
                        <div className="logo">
                            <Link to="index">TODO_APP</Link>
                        </div>
                        <div className="menu">
                            filters: 
                            <Link to="filter" params={{filter: "all"}}>all</Link>
                            <Link to="filter" params={{filter: "active"}}>active</Link>
                            <Link to="filter" params={{filter: "outdated"}}>outdated</Link>
                            <Link to="filter" params={{filter: "done"}}>done</Link>
                        </div>
                    </header>
                    <div className="list-container">
                        <RouteHandler {...this.props}/>
                    </div>
                    <div className="push"></div>
                </div>
                <div className="bottom-container">
                    <div className="form-container">
                        <Form/>
                    </div>
                    <footer className="app-footer">
                        <span className="signature">kolyan-molyan.com</span>
                        <span className="year">{ ""+(new Date()).getFullYear() }</span>
                    </footer>
                </div>
            </div>
        );
    },

});


export default {
    Page,
    NotFoundPage
};

