/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import Icon from "metabase/components/Icon";
import EmptyState from "metabase/components/EmptyState";
import PopoverWithTrigger from "metabase/components/PopoverWithTrigger";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";

import S from "../components/List.css";

import List from "../components/List";
import SearchHeader from "../components/SearchHeader";
import ActionHeader from "../components/ActionHeader";

import _ from "underscore";

import { loadEntities, setSearchText, setItemSelected, setAllSelected, setArchived } from "../questions";
import { loadLabels } from "../labels";
import {
    getSection, getEntityIds,
    getSectionLoading, getSectionError,
    getSearchText,
    getVisibleCount, getSelectedCount, getAllAreSelected, getSectionIsArchive,
    getLabelsWithSelectedState
} from "../selectors";


const mapStateToProps = (state, props) => {
  return {
      section:          getSection(state, props),
      entityIds:        getEntityIds(state, props),
      loading:          getSectionLoading(state, props),
      error:            getSectionError(state, props),

      searchText:       getSearchText(state, props),

      visibleCount:     getVisibleCount(state, props),
      selectedCount:    getSelectedCount(state, props),
      allAreSelected:   getAllAreSelected(state, props),
      sectionIsArchive: getSectionIsArchive(state, props),

      labels:           getLabelsWithSelectedState(state, props),
  }
}

const mapDispatchToProps = {
    setItemSelected,
    setAllSelected,
    setSearchText,
    setArchived,
    loadEntities,
    loadLabels
}

const SECTIONS = [
    {
        section: 'all',
        name: '全部',
        icon: 'all',
        empty: '暂无记录...',
    },
    {
        section: 'fav',
        name: '星标查询',
        icon: 'star',
        empty: '暂无记录...',
    },
    {
        section: 'recent',
        name: '最近查看',
        icon: 'recents',
        empty: '暂无记录...',
    },
    {
        section: 'mine',
        name: '我的查询',
        icon: 'mine',
        empty:  '暂无记录。'
    },
    {
        section: 'popular',
        name: '热门查询',
        icon: 'popular',
        empty: '热门查询将在此处显示。',
    },
    {
        section: 'archived',
        name: "归档",
        icon: 'archive',
        empty: '当您不在使用某查询时，您可以将它归档。'
    }
];

const DEFAULT_SECTION = {
    icon: 'all',
    empty: '没有找到符合此条件的查询。'
}

@connect(mapStateToProps, mapDispatchToProps)
export default class EntityList extends Component {
    static propTypes = {
        style:              PropTypes.object,

        entityQuery:        PropTypes.object.isRequired,
        entityType:         PropTypes.string.isRequired,

        section:            PropTypes.string,
        loading:            PropTypes.bool.isRequired,
        error:              PropTypes.any,
        entityIds:          PropTypes.array.isRequired,
        searchText:         PropTypes.string.isRequired,
        setSearchText:      PropTypes.func.isRequired,
        visibleCount:       PropTypes.number.isRequired,
        selectedCount:      PropTypes.number.isRequired,
        allAreSelected:     PropTypes.bool.isRequired,
        sectionIsArchive:   PropTypes.bool.isRequired,
        labels:             PropTypes.array.isRequired,
        setItemSelected:    PropTypes.func.isRequired,
        setAllSelected:     PropTypes.func.isRequired,
        setArchived:        PropTypes.func.isRequired,

        loadEntities:       PropTypes.func.isRequired,
        loadLabels:         PropTypes.func.isRequired,

        onEntityClick:      PropTypes.func,
        onChangeSection:    PropTypes.func,
        showSearchWidget:   PropTypes.bool.isRequired,
        showCollectionName: PropTypes.bool.isRequired,
        editable:           PropTypes.bool.isRequired,

        defaultEmptyState:  PropTypes.string
    };

    static defaultProps = {
        showSearchWidget: true,
        showCollectionName: true,
        editable: true,
    }

    componentDidUpdate(prevProps) {
        // Scroll to the top of the list if the section changed
        // A little hacky, something like https://github.com/taion/scroll-behavior might be better
        if (this.props.section !== prevProps.section) {
            ReactDOM.findDOMNode(this).scrollTop = 0;
        }
    }

    componentWillMount() {
        this.props.loadLabels();
        this.props.loadEntities(this.props.entityType, this.props.entityQuery);
    }
    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.entityQuery, nextProps.entityQuery) || nextProps.entityType !== this.props.entityType) {
            this.props.loadEntities(nextProps.entityType, nextProps.entityQuery);
        }
    }

    getSection () {
        return _.findWhere(SECTIONS, { section: this.props.entityQuery && this.props.entityQuery.f || "all" }) || DEFAULT_SECTION;
    }

    render() {
        const {
            style,
            loading, error,
            entityType, entityIds,
            searchText, setSearchText, showSearchWidget,
            visibleCount, selectedCount, allAreSelected, sectionIsArchive, labels,
            setItemSelected, setAllSelected, setArchived, onChangeSection,
            showCollectionName,
            editable, onEntityClick,
        } = this.props;

        const section = this.getSection();

        const showActionHeader = (editable && selectedCount > 0);
        const showSearchHeader = (entityIds.length > 0 && showSearchWidget);
        const showEntityFilterWidget = onChangeSection;
        return (
            <div className="full" style={style}>
                <div className="full">
                    { (showActionHeader || showSearchHeader || showEntityFilterWidget) &&
                        <div className="flex align-center my1" style={{height: 40}}>
                            { showActionHeader ?
                                <ActionHeader
                                    visibleCount={visibleCount}
                                    selectedCount={selectedCount}
                                    allAreSelected={allAreSelected}
                                    sectionIsArchive={sectionIsArchive}
                                    setAllSelected={setAllSelected}
                                    setArchived={setArchived}
                                    labels={labels}
                                />
                            : showSearchHeader ?
                                <SearchHeader
                                    searchText={searchText}
                                    setSearchText={setSearchText}
                                />
                            :
                                null
                          }
                          { showEntityFilterWidget && entityIds.length > 0 &&
                              <EntityFilterWidget
                                section={section}
                                onChange={onChangeSection}
                              />
                          }
                        </div>
                    }
                    <LoadingAndErrorWrapper className="full" loading={!error && loading} error={error}>
                    { () =>
                        entityIds.length > 0 ?
                            <List
                                entityType={entityType}
                                entityIds={entityIds}
                                editable={editable}
                                setItemSelected={setItemSelected}
                                onEntityClick={onEntityClick}
                                showCollectionName={showCollectionName}
                            />
                        :
                            <div className={S.empty}>
                                <EmptyState message={section.section === "all" && this.props.defaultEmptyState ? this.props.defaultEmptyState : section.empty} icon={section.icon} />
                            </div>
                    }
                    </LoadingAndErrorWrapper>
                </div>
            </div>
        );
    }
}

class EntityFilterWidget extends Component {
    static propTypes = {
        section: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    }
    render() {
        const { section, onChange } = this.props;
        return (
            <PopoverWithTrigger
                ref={p => this.popover = p}
                triggerClasses="block ml-auto flex-no-shrink"
                targetOffsetY={10}
                triggerElement={
                    <div className="ml2 flex align-center text-brand">
                        <span className="text-bold">{section && section.name}</span>
                        <Icon
                            ref={i => this.icon = i}
                            className="ml1"
                            name="chevrondown"
                            width="12"
                            height="12"
                        />
                    </div>
                }
                target={() => this.icon}
            >
                <ol className="text-brand mt2 mb1">
                    { SECTIONS.filter(item => item.section !== "archived").map((item, index) =>
                        <li
                            key={index}
                            className="cursor-pointer flex align-center brand-hover px2 py1 mb1"
                            onClick={() => {
                                onChange(item.section);
                                this.popover.close();
                            }}
                        >
                            <Icon
                                className="mr1 text-light-blue"
                                name={item.icon}
                            />
                            <h4 className="List-item-title">
                                {item.name}
                            </h4>
                        </li>
                    ) }
                </ol>
            </PopoverWithTrigger>
        )
    }
}
