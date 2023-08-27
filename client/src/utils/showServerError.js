import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'

export default function showServerError(errorMessage) {
    const MySwall = withReactContent(Swal);
    MySwall.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
        footer: '<a href="">Please contact administrator if you hope that is error on our side.<a/>'
    });    
}