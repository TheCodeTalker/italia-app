/**
 * CITTADINANZA DIGITALE
 * io.italia.it
 *
 * @flow
 */

import * as React from 'react'
import { Image } from 'react-native'
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  DeckSwiper,
  H2,
  Icon,
  Left,
  Text,
  Thumbnail,
  View
} from 'native-base'
import { PortfolioStyles } from '../../components/styles'
import PortfolioAPI from '../../lib/portfolio/portfolio-api'

import type { NavigationScreenProp, NavigationState } from 'react-navigation'
import ROUTES from '../../navigation/routes'

const Content = require('native-base').Content

type Props = {
  navigation: NavigationScreenProp<NavigationState>
};

const cards = PortfolioAPI.getCreditCards()

/**
 * Select Credit Card
 */
class CreditCardsScreen extends React.Component<Props>
{
  static navigationOptions = {
    title: 'Credit Cards'
  }

  constructor(props: Props)
  {
    super(props)
  }

  render(): React.Node
  {
    const { navigate } = this.props.navigation
    return (

      <Container>
        <Content>
          <H2 style={PortfolioStyles.titleStyle}>{'Carte di Credito / Debito'}</H2>
          <Text style={PortfolioStyles.titleStyle}>{'Metodi di pagamento'}</Text>
          <View style={{ minHeight: 400 }}>
            <DeckSwiper
              dataSource={cards}
              renderItem={ item =>
                <Card style={{ elevation: 3 }}>
                  <CardItem>
                    <Left>
                      <Thumbnail source={item.image}/>
                      <Body>
                      <Text>{item.brand}</Text>
                      <Text note>{item.number}</Text>
                      </Body>
                    </Left>
                  </CardItem>
                  <CardItem cardBody>
                    <Image style={{ height: 200, flex: 1 }} source={item.image}/>
                  </CardItem>
                  <CardItem>
                    <Icon name="arrow-right" style={{ color: '#0066CC' }}/>
                    <Button transparent title="Transactions"
                            onPress={(): boolean => navigate(ROUTES.PORTFOLIO_CARDS_OPERATIONS, { card: item })}>
                      <Text>{item.lastUsage}</Text>
                    </Button>
                  </CardItem>
                </Card>
              }
            />
          </View>
        </Content>
      </Container>

    )
  }
}

export default CreditCardsScreen
