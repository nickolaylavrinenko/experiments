
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
            <div className="appWrapper">
                <div className="topContainer">
                    <header className="appHeader">
                        <div className="appHeader_logo">TODO_APP</div>
                    </header>
                    <p className="errorMessage"> 
                        Sorry, the page is not found.
                    </p>
                    <div className="push"></div>
                </div>
                <div className="bottomContainer">
                    <footer className="appFooter">
                        <span className="appFooter_signature">kolyan-molyan.com</span>
                        <span className="appFooter_year">{""+(new Date()).getFullYear()}</span>
                    </footer>
                </div>
            </div>
        );
    },

});


var Page = React.createClass({

    render : function() {
        return (
            <div className="appWrapper">
                <div className="topContainer">
                    <header className="appHeader">
                        <div className="appHeader_logo">
                            <Link to="index">TODO_APP</Link>
                        </div>
                        <div className="appHeader_menu">
                            Filters: 
                            <Link to="filter" params={{filter: "all"}}>all</Link>
                            <Link to="filter" params={{filter: "active"}}>active</Link>
                            <Link to="filter" params={{filter: "outdated"}}>outdated</Link>
                            <Link to="filter" params={{filter: "done"}}>done</Link>
                            <Link to="filter" params={{filter: "removed"}}>removed</Link>
                        </div>
                    </header>
                    <div className="listContainer">
                        <RouteHandler {...this.props}/>
                    </div>
                    <div className="push"></div>
                </div>
                <div className="bottomContainer">
                    <div className="formContainer">
                        <Form/>
                    </div>
                    <footer className="appFooter">
                        <span className="appFooter_signature">kolyan-molyan.com</span>
                        <span className="appFooter_year">{ ""+(new Date()).getFullYear() }</span>
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

