/**
 * CITTADINANZA DIGITALE
 * io.italia.it
 *
 * @flow
 */

import * as React from 'react'

import {
  Container,
  Content,
  Grid,
  H2,
  Left,
  Right,
  Row,
  Text } from 'native-base'
import { PortfolioStyles } from '../../components/styles'
import { UNKNOWN_CARD } from '../../lib/portfolio/unknowns'
import PortfolioAPI from '../../lib/portfolio/portfolio-api'
import OperationsList from '../../components/portfolio/OperationsComponent'

import type { Operation, CreditCard } from '../../lib/portfolio/types'
import type { NavigationScreenProp, NavigationState } from 'react-navigation'

type Props = {
  navigation: NavigationScreenProp<NavigationState>,
  card: CreditCard
};


/**
 * Show credit card transactions
 */
class TransactionsScreen extends React.Component<Props>
{
  static navigationOptions = {
      title: 'Transactions'
  }

  render(): React.Node
  {
    const { params } = this.props.navigation.state;
    const card: CreditCard = params ? params.card : UNKNOWN_CARD;
    const operations: ReadonlyArray<Operation> = PortfolioAPI.getOperations(card.id);
    const TITLE: string = 'OPERAZIONI';

    return (

      <Container>
        <Content>
          <Grid>
            <Row size={1}>
              <Text note>{card.brand} - {card.number}</Text>
            </Row>
            <Row size={1}>
              <Left>
                <H2 style={PortfolioStyles.titleStyle}>{TITLE}</H2>
              </Left>
              <Right>
                <Text note>{'Totale'}</Text>
              </Right>
            </Row>
            <Row>
              <OperationsList parent='Transactions' operations={operations}/>
            </Row>
          </Grid>
        </Content>
      </Container>

    )
  }
}

export default TransactionsScreen
