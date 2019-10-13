import React from 'react';
import { Redirect } from 'react-router-dom';
import api from '../../common/api';
import { FullPageLoader } from '../../components';

const withAuth = (WrappedComponent) => {
  return class WithAuthHOC extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user: null,
        loading: true,
        error: null
      };
    }

    componentDidMount() {
      this.setState({ loading: true });
      api
        .get('/whoami')
        .then(res => {
          this.setState({
            user: res.data,
            loading: false
          });
        })
        .catch(err => {
          this.setState({
            error: err,
            loading: false
          })
        })
    }
  
    render() {
      if (this.state.loading) {
        return <FullPageLoader />;
      }

      if (this.state.error) {
        console.log('Should Redirect');
        return <Redirect to='/login' /> 
      }

      return (
        <WrappedComponent
          user={this.state.user}
          {...this.props}
        />
      );
    }
  }
};

export default withAuth;
