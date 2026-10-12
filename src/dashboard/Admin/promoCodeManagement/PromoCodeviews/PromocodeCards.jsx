import { motion } from "framer-motion";
import {
    
    FiEdit,
    FiTrash2,
    
    FiToggleLeft,
    FiToggleRight,
} from "react-icons/fi";

const PromoCardView = ({ promos, onEdit, onDelete, onToggle }) => {

    return (
        <div className="grid md:grid-cols-3 gap-6">
            {promos.map((p) => (
                <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border rounded-xl p-5"
                >
                    <div className="flex justify-between">
                        <h3 className="font-semibold">{p.code}</h3>
                        <span className={p.isActive ? "text-green-600" : "text-red-500"}>
                            {p.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>

                    <p className="text-sm text-gray-500">
                        {p.discountType === "percentage"
                            ? `${p.discountValue}%`
                            : `₹${Number(p.discountValue || 0).toLocaleString('en-IN')}`}
                    </p>

                    <p className="text-xs">
                        Used: {p.usedCount || 0}/{p.usageLimit || "∞"}
                    </p>

                    <p className="text-xs">
                        {p.influencerName}
                    </p>

                    <div className="flex gap-3 mt-4">
                        <FiEdit onClick={() => onEdit(p)} className="cursor-pointer text-blue-600" />
                        <FiTrash2 onClick={() => onDelete(p._id)} className="cursor-pointer text-red-500" />
                        <div onClick={() => onToggle(p._id)} className="cursor-pointer">
                            {p.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
export default PromoCardView