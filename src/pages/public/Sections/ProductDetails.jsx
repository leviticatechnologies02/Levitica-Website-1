import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    FaCheckCircle,
    FaGlobe,
    FaArrowLeft,
    FaCheck
} from "react-icons/fa";
import { productsData } from "@/data/productsData";

const getProductLogo = (product) => {
    if (product.logo) {
        if (typeof product.logo === "string") {
            return product.logo;
        }
        if (Array.isArray(product.logo)) {
            for (const logoPath of product.logo) {
                if (logoPath && logoPath !== "null" && logoPath !== "undefined") {
                    return logoPath;
                }
            }
        }
    }

    return "/img/leviticalogo.png";
};

const hasCustomLogo = (product) => {
    return product.logo && product.logo !== "/img/leviticalogo.png";
};

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        AOS.init({
            duration: 900,
            easing: "ease-out-cubic",
            once: false,
            offset: 80,
        });
    }, []);

    useEffect(() => {
        const productKey = Object.keys(productsData).find(
            (key) => key === slug || productsData[key].title.toLowerCase().replace(/\s+/g, "-") === slug
        );

        if (productKey) {
            setProduct(productsData[productKey]);
        } else {
            setProduct(null);
        }
        setLoading(false);
    }, [slug]);

    if (loading) {
        return <div className="text-center py-24 text-gray dark:text-white">Loading product details...</div>;
    }

    if (!product) {
        return (
            <div className="text-center py-24 px-4 bg-white dark:bg-darkmode min-h-screen flex flex-col justify-center items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-midnight_text dark:text-white mb-4">Product Not Found</h2>
                <p className="text-gray mb-8">The product you are looking for doesn't exist or has been moved.</p>
                <Link to="/" className="btn btn-primary flex items-center gap-2">
                    <FaArrowLeft /> Back to Home
                </Link>
            </div>
        );
    }

    const productLogo = getProductLogo(product);
    const hasProductLogo = hasCustomLogo(product);
    const displayLogo = (!logoError && productLogo) ? productLogo : "/img/leviticalogo.png";

    return (
        <div className="bg-white dark:bg-darkmode min-h-screen pt-5">

            <section className="relative pt-16 md:pt-28 pb-12 bg-gradient-to-b from-white to-herobg dark:from-darkmode dark:to-darklight border-b border-lightgray dark:border-dark_border/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/products" className="inline-flex items-center gap-2 text-primary dark:text-cyan hover:underline mb-6 text-sm font-medium">
                        <FaArrowLeft /> Back to Products
                    </Link>
                    <div className="grid md:grid-cols-12 gap-8 items-center">
                        <div className="col-span-8" data-aos="fade-right">
                            <span className="bg-primary/10 dark:bg-cyan/10 text-primary dark:text-cyan text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                {product.deployment || "Enterprise SaaS"}
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-midnight_text dark:text-white mt-4">
                                {product.title}
                            </h1>
                            <p className="text-lg md:text-xl text-gray dark:text-slate-300 mt-2 font-medium">
                                {product.subtitle}
                            </p>
                        </div>
                        <div className="col-span-4 flex justify-center" data-aos="fade-left">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-dark_border bg-white p-2">
                                <img
                                    key={productLogo}
                                    src={displayLogo}
                                    alt={`${product.title} logo`}
                                    className="w-full h-full object-contain rounded-xl"
                                    onError={() => {
                                        if (!logoError && hasProductLogo) {
                                            console.warn(`Product logo failed to load: ${productLogo}`);
                                            setLogoError(true);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-section dark:bg-darkmode">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-7 xl:col-span-8">
                            {product.image && (
                                <div className="mb-10 h-[300px] md:h-[400px] overflow-hidden rounded-2xl border border-lightgray dark:border-dark_border/20 shadow-sm" data-aos="zoom-in">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="prose dark:prose-invert max-w-none mb-10" data-aos="fade-up">
                                <h3 className="text-2xl font-bold text-midnight_text dark:text-white mb-4">
                                    About {product.title}
                                </h3>
                                <p className="text-base text-gray dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                    {product.fullDescription || product.description}
                                </p>
                            </div>

                            <div className="mb-12" data-aos="fade-up">
                                <h3 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">
                                    Key Capabilities & Features
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {product.features && product.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3 bg-white dark:bg-semidark p-4 rounded-xl border border-lightgray dark:border-dark_border/20 shadow-sm">
                                            <div className="mt-1 p-1 bg-primary/10 dark:bg-cyan/10 rounded-full flex-shrink-0">
                                                <FaCheck className="text-primary dark:text-cyan text-xs" />
                                            </div>
                                            <span className="text-sm font-medium text-gray dark:text-slate-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8" data-aos="fade-up">
                                <h3 className="text-2xl font-bold text-midnight_text dark:text-white mb-6">
                                    Value & Benefits
                                </h3>
                                <div className="space-y-4">
                                    {product.benefits && product.benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex gap-4 items-start">
                                            <FaCheckCircle className="text-primary dark:text-cyan text-lg mt-1 flex-shrink-0" />
                                            <p className="text-base text-gray dark:text-slate-300 leading-relaxed font-medium">
                                                {benefit}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <div className="lg:col-span-5 xl:col-span-4">
                            <div
                                className="sticky top-28 bg-white dark:bg-semidark p-6 md:p-8 rounded-2xl border border-lightgray dark:border-dark_border/20 shadow-property flex flex-col gap-4"
                                data-aos="fade-left"
                            >
                                <h3 className="text-xl font-bold text-midnight_text dark:text-white mb-2">
                                    Get Started
                                </h3>
                                <Link
                                    to={`/products/${slug}/enquiry`}
                                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover dark:bg-cyan dark:hover:bg-cyan-hover text-white dark:text-midnight_text font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 w-full"
                                >
                                    Register Now →
                                </Link>
                                {product.link && (
                                    <a
                                        href={product.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center justify-center gap-2 border border-primary dark:border-cyan text-primary dark:text-cyan hover:bg-primary/5 dark:hover:bg-cyan/10 font-semibold px-6 py-3 rounded-lg transition duration-300 w-full"
                                    >
                                        <FaGlobe /> Visit Website
                                    </a>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};

export default ProductDetails;
