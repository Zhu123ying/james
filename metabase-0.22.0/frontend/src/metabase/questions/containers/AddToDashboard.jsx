import React, { Component } from "react";

import Button from "metabase/components/Button.jsx";
import ModalContent from "metabase/components/ModalContent.jsx";
import Icon from "metabase/components/Icon.jsx";
import HeaderWithBack from "metabase/components/HeaderWithBack";

import Collections from "./CollectionList";
import EntityList from "./EntityList";
import ExpandingSearchField from "../components/ExpandingSearchField.jsx";

export default class AddToDashboard extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collection: null,
            query: null
        }
    }

    render() {
        const { query, collection } = this.state;
        return (
            <ModalContent
                title="将查询加入数据面板"
                className="mx4 mb4"
            >
                <div className="py1 flex align-center">
                    { !query ?
                        <ExpandingSearchField
                            defaultValue={query && query.q}
                            onSearch={(value) => this.setState({
                                collection: null,
                                query: { q: value }
                            })}
                        />
                    :
                        <HeaderWithBack
                            name={collection && collection.name}
                            onBack={() => this.setState({ collection: null, query: null })}
                        />
                    }
                    { query &&
                        <div className="ml-auto flex align-center">
                            <h5>排序</h5>
                            <Button borderless>
                                编辑时间
                            </Button>
                            <Button borderless>
                                字母排序
                            </Button>
                        </div>
                    }
                </div>
                { this.state.query ?
                    <EntityList
                        entityType="cards"
                        entityQuery={this.state.query}
                        editable={false}
                        showSearchWidget={false}
                        onEntityClick={this.props.onAdd}
                    />
                :
                    <Collections>
                        { collections =>
                            <ol>
                                { collections.map((collection, index) =>
                                    <li
                                        className="text-brand-hover flex align-center border-bottom cursor-pointer py1 mb1"
                                        key={index}
                                        onClick={() => this.setState({
                                            collection: collection,
                                            query: { collection: collection.slug }
                                        })}
                                    >
                                        <Icon
                                            className="mr2"
                                            name="all"
                                            style={{ color: collection.color }}
                                        />
                                        <h3>{collection.name}</h3>
                                        <Icon
                                            className="ml-auto"
                                            name="chevronright"
                                        />
                                    </li>
                                )}
                                <li
                                    className="text-brand-hover flex align-center border-bottom cursor-pointer py1 mb1"
                                    onClick={() => this.setState({
                                        collection: { name: "Everything else" },
                                        query: { collection: "" }
                                    })}
                                >
                                        <Icon
                                            className="mr2"
                                            name="star"
                                        />
                                        <h3>Everything else</h3>
                                        <Icon
                                            className="ml-auto"
                                            name="chevronright"
                                        />
                                </li>
                            </ol>
                        }
                    </Collections>
                }
            </ModalContent>
        );
    }
}
