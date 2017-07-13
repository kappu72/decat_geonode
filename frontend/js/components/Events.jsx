/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Grid, Row, Col, Glyphicon, FormControl, InputGroup} = require('react-bootstrap');
const PropTypes = require('prop-types');

const PaginationToolbar = require('../../MapStore2/web/client/components/misc/PaginationToolbar');

class Events extends React.Component {
    static propTypes = {
        events: PropTypes.array,
        className: PropTypes.string,
        page: PropTypes.number,
        pageSize: PropTypes.number,
        total: PropTypes.number,
        height: PropTypes.number,
        onAddEvent: PropTypes.func,
        isAuthorized: PropTypes.func,
        searchInput: PropTypes.string,
        serchedText: PropTypes.string,
        onSearchTextChange: PropTypes.function,
        resetAlertsTextSearch: PropTypes.function,
        loadEvents: PropTypes.function
    };

    static defaultProps = {
        events: [],
        className: 'd-hazard',
        page: 0,
        pageSize: 100,
        total: 100,
        height: 400,
        searchInput: '',
        onAddEvent: () => {},
        isAuthorized: () => (false),
        onSearchTextChange: () => {},
        resetAlertsTextSearch: () => {},
        loadEvents: () => {}
    };

    renderCards = () => {
        return this.props.events.map((event, idx) => (
            <Row key={idx} className={this.props.className + ' flex-center'}>
              <Col xs="2" className="text-center ">
                <h5 className={'fa icon-eq d-text-' + event.properties.level + ' fa-2x'}></h5>
              </Col>
              <Col xs="7">
                  <Grid fluid>
                    <Row>
                      <Col xs="12">
                        <h5><strong>{event.properties.title}</strong></h5>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs="12" className={"d-text-" + event.properties.level}>
                          {event.properties.level}
                      </Col>
                    </Row>
                    <Row>
                        <Col xs="12" className="d-text-description">
                          From: {event.properties.source.name}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" className="d-text-description">
                            Reported Time: {event.properties.reported_at}
                        </Col>
                    </Row>
                </Grid>

              </Col>
              <Col xs="2" className="text-center">
                  <div className="fa fa-paper-plane btn-send"></div>
              </Col>

          </Row>));
    };
    render() {
        const {searchInput} = this.props;
        const renderSearch = !searchInput || searchInput.length === 0;
        return (
            <div>
                <Grid fluid>
                    <Row>
                        <Grid fluid>
                            <form lpformnum="2">
                                <InputGroup>
                                    <FormControl placeholder="search alert..." value={this.props.searchInput} onChange={this.searchTextChange}
                                        />
                                        <InputGroup.Addon onClick={this.resetText}>
                                        <Glyphicon glyph={renderSearch && "search" || "1-close"}/>
                                    </InputGroup.Addon>
                                    {true || this.props.isAuthorized('addevent') ? <InputGroup.Addon onClick={this.props.onAddEvent}><Glyphicon glyph="plus" /></InputGroup.Addon> : null}
                                </InputGroup>
                            </form>
                        </Grid>
                    </Row>
                    <Row>
                        <Col xs="12">
                            <Row>
                                <div style={{overflow: 'auto', height: this.props.height - (84 + 34) }}>
                                    {this.renderCards()}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" className="text-center">
                            <PaginationToolbar items={this.props.events} pageSize={this.props.pageSize} page={this.props.page} total={this.props.total} onSelect={this.handlePageChange}/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
    searchTextChange = (e) => {
        this.props.onSearchTextChange(e.target.value);
    }
    resetText = () => {
        if (this.props.searchInput.length > 0) {
            this.props.resetAlertsTextSearch();
        }
    }
    handlePageChange = (page) => {
        this.props.loadEvents(undefined, page);
    }
}

module.exports = Events;
