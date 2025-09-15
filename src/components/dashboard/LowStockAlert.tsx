import React from "react";
import { AlertTriangle, Package } from "lucide-react";
import { formatNumber } from "../../utils";
import { StoreInventory } from "../../types";
//import LoadingSpinner from "../ui/LoadingSpinner";

interface LowStockAlertProps {
  items: StoreInventory[];
  loading?: boolean;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({
  items,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-secondary-900">
            Low Stock Alert
          </h3>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary-200 rounded animate-pulse" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-secondary-200 rounded animate-pulse w-3/4" />
                  <div className="h-2 bg-secondary-200 rounded animate-pulse w-1/2" />
                </div>
                <div className="h-5 bg-secondary-200 rounded animate-pulse w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const lowStockItems = items.filter(
    (item) => item.quantityAvailable <= (item.reorderLevel || 10)
  );

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-secondary-900">
            Low Stock Alert
          </h3>
          {lowStockItems.length > 0 && (
            <span className="badge badge-error">
              {lowStockItems.length} items
            </span>
          )}
        </div>
      </div>
      <div className="card-body">
        {lowStockItems.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-success-400 mx-auto mb-4" />
            <p className="text-success-600 font-medium">All items in stock</p>
            <p className="text-sm text-secondary-500">No low stock alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 rounded-lg bg-warning-50 border border-warning-200"
              >
                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-warning-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">
                    {item.productId}
                  </p>
                  <p className="text-xs text-secondary-500">
                    Store: {item.storeId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-warning-600">
                    {formatNumber(item.quantityAvailable)}
                  </p>
                  <p className="text-xs text-secondary-500">left</p>
                </div>
              </div>
            ))}
            {lowStockItems.length > 5 && (
              <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium py-2">
                View {lowStockItems.length - 5} more items
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockAlert;
