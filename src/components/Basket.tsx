import * as storeA from "actions/store";
import * as userA from "actions/user";
import { BasketItem } from "components/BasketItem";
import { basketPrice } from "helpers/store";
import { IBasketItem } from "models/item";
import * as React from "react";
import { connect } from "react-redux";
import { RootState } from "reducers/root-reducer";
import { Dispatch } from "redux";

interface IStateFromProps {
    basket: IBasketItem[];
    balance?: number;
}

interface IDispatchFromProps {
    completePurchase: () => void;
    subtractFromBalance: (delta: number) => void;
}

const mapDispatchToProps = (
    dispatch: Dispatch<userA.UserAction | storeA.StoreAction>,
): IDispatchFromProps => ({
    completePurchase: () => dispatch(storeA.completePurchase()),
    subtractFromBalance: (delta: number) => dispatch(userA.subtractFromBalance(delta)),
});

interface IProps extends IStateFromProps, IDispatchFromProps {}

class BasketContainer extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);

        this.completePurchase = this.completePurchase.bind(this);
        this.purchaseDisabled = this.purchaseDisabled.bind(this);
    }

    public render() {
        return (
            <div>
                <h2>Handlekurv</h2>
                {this.props.basket.map((item: IBasketItem, index: number) => (
                    <BasketItem key={index} {...item} />
                ))}
                <button onClick={this.completePurchase} disabled={this.purchaseDisabled()}>Betal</button>
                <p>Saldo etter kjøp: {this.props.balance! - basketPrice(this.props.basket)}NOK.</p>
            </div>
        );
    }

    private completePurchase() {
        this.props.completePurchase();
        this.props.subtractFromBalance(basketPrice(this.props.basket));
    }

    private purchaseDisabled(): true | undefined {
        return basketPrice(this.props.basket) > this.props.balance! ? true : undefined;
    }
}

export const Basket = connect<IStateFromProps, IDispatchFromProps, {}, RootState>(
    (state: RootState): IStateFromProps => ({ basket: state.store.basket, balance: state.auth.balance }),
    mapDispatchToProps,
)(BasketContainer);
