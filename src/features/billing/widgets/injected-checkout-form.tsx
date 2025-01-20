/*
  Appellation: checkout_form <checkout>
  Contrib: @FL03
*/
'use client';
import * as React from 'react';
import { ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js';

const stripeConfig = {
  confirmParams: {
    return_url: 'https://example.com/order/123/complete',
  },
};



type CheckoutFormProps = {
  configParams?: any;
  elements: any;
  stripe: any;
}
class CheckoutForm extends React.PureComponent<CheckoutFormProps> {
  handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    const { stripe, elements } = this.props;

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: stripeConfig.confirmParams,
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <PaymentElement />
        <button disabled={!this.props.stripe}>Submit</button>
      </form>
    );
  }
}

export default function InjectedCheckoutForm() {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <CheckoutForm stripe={stripe} elements={elements} />
      )}
    </ElementsConsumer>
  );
}
export { InjectedCheckoutForm };