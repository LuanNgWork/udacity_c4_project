import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  FormInput
} from 'semantic-ui-react'

import { createCartItem, deleteCartItem, getCartItems, patchCartItem } from '../api/cart-items-api'
import Auth from '../auth/Auth'
import { CartItem } from '../types/CartItem'

interface CartItemsProps {
  auth: Auth
  history: History
}

interface CartItemsState {
  cartItems: CartItem[]
  newCartItemName: string
  newCartItemDescription: string
  newCartItemPrice: number
  loadingCartItems: boolean
}

export class CartItems extends React.PureComponent<CartItemsProps, CartItemsState> {
  state: CartItemsState = {
    cartItems: [],
    newCartItemName: '',
    newCartItemDescription: '',
    newCartItemPrice: 0,
    loadingCartItems: true,
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCartItemName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCartItemDescription: event.target.value })
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof +event.target.value === 'number') {
      this.setState({ newCartItemPrice: +event.target.value })
    }
  }

  onEditButtonClick = (itemId: string) => {
    this.props.history.push(`/cartItems/${itemId}/edit`)
  }

  onCartItemCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newCartItem = await createCartItem(this.props.auth.getIdToken(), {
        name: this.state.newCartItemName,
        description: this.state.newCartItemDescription,
        price: this.state.newCartItemPrice
      })
      this.setState({
        cartItems: [...this.state.cartItems, newCartItem],
        newCartItemName: ''
      })
    } catch {
      alert('CartItem creation failed')
    }
  }

  onCartItemDelete = async (itemId: string) => {
    try {
      await deleteCartItem(this.props.auth.getIdToken(), itemId)
      this.setState({
        cartItems: this.state.cartItems.filter(cartItem => cartItem.itemId !== itemId)
      })
    } catch {
      alert('CartItem deletion failed')
    }
  }

  onCartItemCheck = async (pos: number) => {
    try {
      const cartItem = this.state.cartItems[pos]
      await patchCartItem(this.props.auth.getIdToken(), cartItem.itemId, {
        name: cartItem.name,
        description: cartItem.description,
        price: cartItem.price,
        done: !cartItem.done
      })
      this.setState({
        cartItems: update(this.state.cartItems, {
          [pos]: { done: { $set: !cartItem.done } }
        })
      })
    } catch {
      alert('CartItem deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const cartItems = await getCartItems(this.props.auth.getIdToken())
      this.setState({
        cartItems,
        loadingCartItems: false
      })
    } catch (e) {
      alert(`Failed to fetch cartItems: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Your Wishlist</Header>

        {this.renderCreateCartItemInput()}

        {this.renderCartItems()}
      </div>
    )
  }

  renderCreateCartItemInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            
            // actionPosition="left"
            placeholder="Enter a device name"
            onChange={this.handleNameChange}
          />
          <Input
            
            // actionPosition="left"
            placeholder="Enter a note"
            onChange={this.handleDescriptionChange}
          />
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New device',
              onClick: this.onCartItemCreate
            }}
            
            placeholder="Enter a device price"
            onChange={this.handlePriceChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCartItems() {
    if (this.state.loadingCartItems) {
      return this.renderLoading()
    }

    return this.renderCartItemsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading TODOs
        </Loader>
      </Grid.Row>
    )
  }

  renderCartItemsList() {
    return (
      <Grid padded>
        {this.state.cartItems.map((cartItem, pos) => {
          return (
            <Grid.Row key={cartItem.itemId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onCartItemCheck(pos)}
                  checked={cartItem.done}
                />
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {cartItem.name}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {cartItem.description}
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                {cartItem.price}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(cartItem.itemId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onCartItemDelete(cartItem.itemId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {cartItem.imageUrl && (
                <Image src={cartItem.imageUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
