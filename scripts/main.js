import React from 'react';
import ReactDOM from 'react-dom';
import ReactDataGrid from 'react-data-grid';
import PropTypes from "prop-types";
import createRowData from "./createRowData";

const COLUMN_WIDTH = 140;
const ROW_COUNT = 5000;

const {
  Draggable: {
    Container: DraggableContainer,
    RowActionsCell,
    DropTargetRowContainer
  },
  Data: { Selectors }
} = require("react-data-grid-addons");

const RowRenderer = DropTargetRowContainer(ReactDataGrid.Row);

class Example extends React.Component {
  static propTypes = {
    rowKey: PropTypes.string.isRequired
  };

  static defaultProps = { rowKey: "id" };

  constructor(props, context) {
    super(props, context);
    this._columns = [
      {
        key: "id",
        name: "ID",
        width: COLUMN_WIDTH
      },
      {
        key: "title",
        name: "Title",
        width: COLUMN_WIDTH,
        editable: true
      },
      {
        key: "firstName",
        name: "First Name",
        width: COLUMN_WIDTH,
        editable: true
      },
      {
        key: "lastName",
        name: "Last Name",
        width: COLUMN_WIDTH,
        editable: true
      },
      {
        key: "email",
        name: "Email",
        width: COLUMN_WIDTH
      },
      {
        key: "street",
        name: "Street",
        width: COLUMN_WIDTH
      },
      {
        key: "zipCode",
        name: "ZipCode",
        width: COLUMN_WIDTH
      },
      {
        key: "date",
        name: "Date",
        width: COLUMN_WIDTH
      },
      {
        key: "bs",
        name: "bs",
        width: COLUMN_WIDTH
      },
      {
        key: "catchPhrase",
        name: "Catch Phrase",
        width: COLUMN_WIDTH
      },
      {
        key: "companyName",
        name: "Company Name",
        width: COLUMN_WIDTH
      },
      {
        key: "sentence",
        name: "Sentence",
        width: COLUMN_WIDTH
      }
    ];
    this.state = { rows: createRowData(5000), selectedIds: [1, 2] };
  }

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  rowGetter = i => {
    return this.state.rows[i];
  };

  isDraggedRowSelected = (selectedRows, rowDragSource) => {
    if (selectedRows && selectedRows.length > 0) {
      let key = this.props.rowKey;
      return (
        selectedRows.filter(r => r[key] === rowDragSource.data[key]).length > 0
      );
    }
    return false;
  };

  reorderRows = e => {
    let selectedRows = Selectors.getSelectedRowsByKey({
      rowKey: this.props.rowKey,
      selectedKeys: this.state.selectedIds,
      rows: this.state.rows
    });
    let draggedRows = this.isDraggedRowSelected(selectedRows, e.rowSource)
      ? selectedRows
      : [e.rowSource.data];
    let undraggedRows = this.state.rows.filter(function(r) {
      return draggedRows.indexOf(r) === -1;
    });
    let args = [e.rowTarget.idx, 0].concat(draggedRows);
    Array.prototype.splice.apply(undraggedRows, args);
    this.setState({ rows: undraggedRows });
  };

  onRowsSelected = rows => {
    this.setState({
      selectedIds: this.state.selectedIds.concat(
        rows.map(r => r.row[this.props.rowKey])
      )
    });
  };

  onRowsDeselected = rows => {
    let rowIds = rows.map(r => r.row[this.props.rowKey]);
    this.setState({
      selectedIds: this.state.selectedIds.filter(i => rowIds.indexOf(i) === -1)
    });
  };

  render() {
    return (
      <DraggableContainer>
        <ReactDataGrid
          enableCellSelect={true}
          rowActionsCell={RowActionsCell}
          onGridRowsUpdated={this.onGridRowsUpdated}
          columns={this._columns}
          rowGetter={i => this.state.rows[i]}
          rowsCount={ROW_COUNT}
          minHeight={500}
          rowRenderer={<RowRenderer onRowDrop={this.reorderRows} />}
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: {
              keys: {
                rowKey: this.props.rowKey,
                values: this.state.selectedIds
              }
            }
          }}
        />
      </DraggableContainer>
    );
  }
}

window.onload = function(){
  ReactDOM.render(<Example />, document.getElementById('root'));
}
