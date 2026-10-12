
import {
    
    FiEdit,
    FiTrash2,
    
    FiToggleLeft,
    FiToggleRight,
} from "react-icons/fi";
const PromoTableView = ({ promos, onEdit, onDelete, onToggle }) => {
    return (
        <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr className="text-left text-sm">
                        <th className="p-4">Code</th>
                        <th>Discount</th>
                        <th>Usage</th>
                        <th>Influencer</th>
                        <th>Status</th>
                        <th className="text-right p-4">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {promos.map((p) => (
                        <tr key={p._id} className="border-t">
                            <td className="p-4">{p.code}</td>

                            <td>
                                {p.discountType === "percentage"
                                    ? `${p.discountValue}%`
                                    : `₹${Number(p.discountValue || 0).toLocaleString('en-IN')}`}
                            </td>

                            <td>
                                {p.usedCount || 0}/{p.usageLimit || "∞"}
                            </td>

                            <td>{p.influencerName}</td>

                            <td>
                                <span className={p.isActive ? "text-green-600" : "text-red-500"}>
                                    {p.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>

                            <td className="p-4">
                                <div className="flex justify-end gap-3">
                                    <FiEdit onClick={() => onEdit(p)} className="cursor-pointer text-blue-600" />
                                    <FiTrash2 onClick={() => onDelete(p._id)} className="cursor-pointer text-red-500" />
                                    <div onClick={() => onToggle(p._id)} className="cursor-pointer">
                                        {p.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default PromoTableView