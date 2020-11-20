import * as React from 'react';
import styles from './FieldVisits.module.scss';

import { IConversationService } from '../services/ConversationService/IConversationService';
import { IMapService } from '../services/MapService/IMapService';

export interface IPostToChannelProps {
    channelId?: string;
    entityId: string;
    teamsApplicationId: string;
    selectedUser: string;
    customerId: string;
    customerName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    conversationService: IConversationService;
    mapService: IMapService;
}

export interface IPostToChannelState {
    messageText: string;
}

export class PostToChannel extends React.Component<IPostToChannelProps, IPostToChannelState> {

    constructor(props: IPostToChannelProps) {
        super(props);
        this.state = { messageText: '' };
    }

    public render(): React.ReactElement<IPostToChannelProps> {

        if (this.props.customerId && this.props.customerName) {

            return (
                <div className={styles.postToChannel}>
                    <div className={styles.genericHeading}>
                        Post to channel
                    </div>
                    <div className={styles.postToChannelRow}>
                        <div className={styles.postToChannelTextColumn}>
                            <textarea className={styles.postToChannelTextArea}
                                onChange={this.handleChange.bind(this)}
                                value={this.state.messageText}
                            />
                        </div>
                        <div className={styles.postToChannelButtonColumn}>
                            <input type='button' value='Send'
                                onClick={this.handleClick.bind(this)}
                                className={styles.postToChannelButton}
                                {...this.props.entityId ? '' : 'disabled'} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<div />);
        }
    }

    private handleChange(event) {
        this.setState({ messageText: event.target.value });
    }

    // Attempting to post the map - getting an undefined URL
    // SO it's commented out for now...
    private async handleClick(event) {

        // Build a deep link to the current user tab and customer
        const deepLinkUrl = encodeURI(
            'https://teams.microsoft.com/l/entity/' +
            this.props.teamsApplicationId + '/' +
            this.props.entityId +
            '?label=Vi32&' +
            'context={"subEntityId": "' +
            this.props.selectedUser + ':' +
            this.props.customerId +
            '", "channelId": "' + this.props.channelId + '"}');

        const mapImageUrl = await this.props.mapService.getMapImageUrl(this.props.address, this.props.city,
            this.props.state, this.props.country, this.props.postalCode, 180, 450);

        var message =
            `
            <div>
                ${this.state.messageText}<br />
                <div>
                    <a style="font-weight: bold;" href="${deepLinkUrl}">${this.props.customerName}</a><br />
                    ${this.props.address}<br />
                    ${this.props.city}, ${this.props.state} ${this.props.postalCode}<br />
                    <img src="${mapImageUrl}"></img>
                </div>
            </div>
            `
            ;

        this.props.conversationService
            .createChatThread(message, "html")
            .then(() => {
                this.setState({ messageText: '' });
            });

    }

}