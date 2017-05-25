import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    stopService
  , startService
  , killService
} from '../actions'
import { LOG_DENSITY } from '../constants';
import Icon from './Icon';
import DropDown from './DropDown';

const mapStateToProps = state => ({
    services: state.services
})
const mapDispatchToProps = dispatch => ({
    dispatch
})


class ServiceList extends Component {
  render() {
    const {
        dispatch
      , services
    } = this.props


    return (
      <div className='ServiceList'>
        <ul className='nav nav-sidebar'>
        { services.map(s => {

          const serviceOptions = [
            s.isRunning ?
                { label: 'Stop',  onClick: () => dispatch(stopService(s)) }
              : { label: 'Start', onClick: () => dispatch(startService(s)) }
            , { label: 'Kill', onClick: () => dispatch(killService(s)) }
          ]

          const isRunning = !s.isUpdating && s.isRunning
          const isStopped = !s.isUpdating && s.isStopped
          const isUpdating = s.isUpdating || s.isStarting || s.isStopping

          return (
            <li key={s.name}
                className=''>
              <a>
                { isRunning &&  <Icon name='check' hl='success' /> }
                { isStopped &&  <Icon name='close' hl='default' /> }
                { isUpdating && <Icon name='circle-o-notch' spin={true} hl='default' /> }
                &nbsp;
                { s.label }
                &nbsp;
                <span className='pull-right'>
                  <DropDown size='xs' options={serviceOptions}>
                    <Icon name='chevron-right' />
                  </DropDown>
                </span>
              </a>
            </li>
          )
        })}
        </ul>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceList);
